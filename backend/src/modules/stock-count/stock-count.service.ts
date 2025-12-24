import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { StockAdjustmentService } from '../stock-adjustment/stock-adjustment.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditContext } from '../stock-issue/stock-issue.service';

@Injectable()
export class StockCountService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private docNumberingService: DocNumberingService,
    private stockAdjustmentService: StockAdjustmentService,
    private auditLogService: AuditLogService,
  ) {}

  async findAll(ctx?: AuditContext) {
    const result = await this.dataSource.query(`
      SELECT sc.*, 
        w.name as warehouse_name_ref,
        u.full_name as created_by_name
      FROM stock_counts sc
      LEFT JOIN warehouses w ON sc.warehouse_id = w.id
      LEFT JOIN users u ON sc.created_by = u.id
      WHERE sc.is_latest_revision = true
      ORDER BY sc.created_at DESC
    `);
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'STOCK_COUNT',
        action: 'VIEW',
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { count: result.length },
      });
    }
    
    return result;
  }

  async findOne(id: number, ctx?: AuditContext) {
    const [count] = await this.dataSource.query(
      `SELECT sc.*, w.name as warehouse_name_ref
       FROM stock_counts sc
       LEFT JOIN warehouses w ON sc.warehouse_id = w.id
       WHERE sc.id = $1`,
      [id]
    );
    
    if (!count) {
      throw new NotFoundException(`Stock Count #${id} not found`);
    }

    const items = await this.dataSource.query(
      `SELECT sci.*, p.code as product_code, p.name as product_name
       FROM stock_count_items sci
       LEFT JOIN products p ON sci.product_id = p.id
       WHERE sci.stock_count_id = $1
       ORDER BY sci.line_no`,
      [id]
    );

    if (ctx) {
      await this.auditLogService.log({
        module: 'STOCK_COUNT',
        action: 'VIEW',
        documentId: id,
        documentNo: count.doc_full_no,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
      });
    }

    return { ...count, items };
  }

  async create(dto: any, ctx: AuditContext) {
    const { warehouseId, countDate, countType, categoryIds, description, remark } = dto;

    const [warehouse] = await this.dataSource.query(
      'SELECT name FROM warehouses WHERE id = $1',
      [warehouseId]
    );

    const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('CNT');

    let productQuery = `
      SELECT 
        p.id as product_id, p.code, p.name, u.name as unit,
        COALESCE(sb.qty_on_hand, 0) as qty_system,
        COALESCE(sb.avg_cost, p.standard_cost, 0) as unit_cost
      FROM products p
      LEFT JOIN units u ON p.unit_id = u.id
      LEFT JOIN stock_balances sb ON p.id = sb.product_id AND sb.warehouse_id = $1
      WHERE p.is_active = true
    `;

    const params: any[] = [warehouseId];

    if (countType === 'PARTIAL' && categoryIds && categoryIds.length > 0) {
      productQuery += ` AND p.category_id = ANY($2)`;
      params.push(categoryIds);
    }

    productQuery += ` ORDER BY p.code`;

    const products = await this.dataSource.query(productQuery, params);

    const [result] = await this.dataSource.query(`
      INSERT INTO stock_counts (
        doc_base_no, doc_revision, doc_full_no, is_latest_revision,
        warehouse_id, warehouse_name, count_date, count_type,
        category_ids, description, status, total_items, remark, created_by
      ) VALUES ($1, 1, $2, true, $3, $4, $5, $6, $7, $8, 'DRAFT', $9, $10, $11)
      RETURNING id
    `, [
      docBaseNo, docFullNo, warehouseId, warehouse?.name, countDate,
      countType, categoryIds ? JSON.stringify(categoryIds) : null,
      description, products.length, remark, ctx.userId
    ]);

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      await this.dataSource.query(`
        INSERT INTO stock_count_items (
          stock_count_id, line_no, product_id, item_code, item_name,
          unit, qty_system, unit_cost, count_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'NOT_COUNTED')
      `, [
        result.id, i + 1, p.product_id, p.code, p.name,
        p.unit, p.qty_system, p.unit_cost
      ]);
    }

    await this.auditLogService.log({
      module: 'STOCK_COUNT',
      action: 'CREATE',
      documentId: result.id,
      documentNo: docFullNo,
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { warehouseId, countType, itemCount: products.length },
    });

    return this.findOne(result.id);
  }

  async startCount(id: number, ctx: AuditContext) {
    const count = await this.findOne(id);

    if (!["DRAFT", "CANCELLED"].includes(count.status)) {
      throw new BadRequestException('Can only start DRAFT counts');
    }

    for (const item of count.items) {
      const [stockInfo] = await this.dataSource.query(`
        SELECT COALESCE(qty_on_hand, 0) as qty_on_hand, COALESCE(avg_cost, 0) as avg_cost
        FROM stock_balances
        WHERE product_id = $1 AND warehouse_id = $2
      `, [item.product_id, count.warehouse_id]);

      await this.dataSource.query(`
        UPDATE stock_count_items 
        SET qty_system = $1, unit_cost = $2
        WHERE id = $3
      `, [stockInfo?.qty_on_hand || 0, stockInfo?.avg_cost || item.unit_cost, item.id]);
    }

    await this.dataSource.query(`
      UPDATE stock_counts 
      SET status = 'IN_PROGRESS', started_at = NOW(), updated_by = $2
      WHERE id = $1
    `, [id, ctx.userId]);

    await this.auditLogService.log({
      module: 'STOCK_COUNT',
      action: 'START',
      documentId: id,
      documentNo: count.doc_full_no,
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });

    return this.findOne(id);
  }

  async updateItemCount(id: number, itemId: number, dto: any, ctx: AuditContext) {
    const { qtyCount1, qtyCount2, remark } = dto;

    const [item] = await this.dataSource.query(
      'SELECT * FROM stock_count_items WHERE id = $1 AND stock_count_id = $2',
      [itemId, id]
    );

    if (!item) {
      throw new NotFoundException('Count item not found');
    }

    let qtyFinal = qtyCount1;
    let countStatus = 'COUNTED';
    
    if (qtyCount2 !== undefined && qtyCount2 !== null) {
      qtyFinal = qtyCount2;
      countStatus = 'RECOUNTED';
    }

    const qtyVariance = qtyFinal - Number(item.qty_system);
    const valueVariance = qtyVariance * Number(item.unit_cost);

    await this.dataSource.query(`
      UPDATE stock_count_items 
      SET qty_count1 = $1, qty_count2 = $2, qty_final = $3,
          qty_variance = $4, value_variance = $5, count_status = $6,
          counted_at = NOW(), counted_by = $7, remark = $8
      WHERE id = $9
    `, [qtyCount1, qtyCount2, qtyFinal, qtyVariance, valueVariance, countStatus, ctx.userId, remark, itemId]);

    await this.updateHeaderCounts(id);

    return this.findOne(id);
  }

  async updateHeaderCounts(id: number) {
    await this.dataSource.query(`
      UPDATE stock_counts sc SET
        counted_items = (
          SELECT COUNT(*) FROM stock_count_items 
          WHERE stock_count_id = $1 AND count_status != 'NOT_COUNTED'
        ),
        variance_items = (
          SELECT COUNT(*) FROM stock_count_items 
          WHERE stock_count_id = $1 AND qty_variance != 0
        ),
        total_variance_value = (
          SELECT COALESCE(SUM(value_variance), 0) FROM stock_count_items 
          WHERE stock_count_id = $1
        )
      WHERE id = $1
    `, [id]);
  }

  async complete(id: number, ctx: AuditContext) {
    const count = await this.findOne(id);

    if (count.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Can only complete IN_PROGRESS counts');
    }

    const uncountedItems = count.items.filter(i => i.count_status === 'NOT_COUNTED');
    if (uncountedItems.length > 0) {
      throw new BadRequestException(`${uncountedItems.length} items are not counted yet`);
    }

    await this.dataSource.query(`
      UPDATE stock_counts 
      SET status = 'COMPLETED', completed_at = NOW(), updated_by = $2
      WHERE id = $1
    `, [id, ctx.userId]);

    await this.auditLogService.log({
      module: 'STOCK_COUNT',
      action: 'COMPLETE',
      documentId: id,
      documentNo: count.doc_full_no,
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { 
        totalItems: count.total_items,
        varianceItems: count.variance_items,
      },
    });

    return this.findOne(id);
  }

  async approve(id: number, ctx: AuditContext) {
    const count = await this.findOne(id);

    if (count.status !== 'COMPLETED') {
      throw new BadRequestException('Can only approve COMPLETED counts');
    }

    await this.dataSource.query(`
      UPDATE stock_counts 
      SET status = 'APPROVED', approved_at = NOW(), approved_by = $2
      WHERE id = $1
    `, [id, ctx.userId]);

    await this.auditLogService.log({
      module: 'STOCK_COUNT',
      action: 'APPROVE',
      documentId: id,
      documentNo: count.doc_full_no,
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { totalVarianceValue: count.total_variance_value },
    });

    return this.findOne(id);
  }

  async createAdjustment(id: number, ctx: AuditContext) {
    const count = await this.findOne(id);

    if (count.status !== 'APPROVED') {
      throw new BadRequestException('Can only create adjustment from APPROVED counts');
    }

    const varianceItems = count.items.filter(i => Number(i.qty_variance) !== 0);

    if (varianceItems.length === 0) {
      throw new BadRequestException('No variance items to adjust');
    }

    const adjustmentDto = {
      warehouseId: count.warehouse_id,
      docDate: new Date(),
      adjustmentType: 'ADJ_COUNT',
      reason: `จากการนับสต็อก ${count.doc_full_no}`,
      remark: count.remark,
      items: varianceItems.map(item => ({
        productId: item.product_id,
        itemCode: item.item_code,
        itemName: item.item_name,
        unit: item.unit,
        qtyCounted: Number(item.qty_final),
        unitCost: Number(item.unit_cost),
      })),
    };

    const adjustment = await this.stockAdjustmentService.create(adjustmentDto, ctx);

    await this.dataSource.query(`
      UPDATE stock_counts 
      SET adjustment_id = $1, status = 'ADJUSTED', updated_by = $2
      WHERE id = $3
    `, [adjustment.id, ctx.userId, id]);

    return { count: await this.findOne(id), adjustment };
  }

  async cancel(id: number, ctx: AuditContext) {
    const count = await this.findOne(id);

    if (!['IN_PROGRESS', 'COMPLETED'].includes(count.status)) {
      throw new BadRequestException('Only IN_PROGRESS or COMPLETED counts can be cancelled');
    }

    const previousStatus = count.status;

    await this.dataSource.query(`
      UPDATE stock_count_items 
      SET qty_count1 = NULL, qty_count2 = NULL, qty_final = NULL, 
          qty_variance = 0, count_status = 'NOT_COUNTED', remark = NULL
      WHERE stock_count_id = $1
    `, [id]);

    await this.dataSource.query(`
      UPDATE stock_counts 
      SET status = 'CANCELLED', 
          counted_items = 0, 
          variance_items = 0, 
          total_variance_value = 0, 
          updated_by = $1
      WHERE id = $2
    `, [ctx.userId, id]);

    await this.auditLogService.log({
      module: 'STOCK_COUNT',
      action: 'CANCEL',
      documentId: id,
      documentNo: count.doc_full_no,
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { previousStatus },
    });

    return this.findOne(id);
  }

  async delete(id: number, ctx: AuditContext) {
    const count = await this.findOne(id);

    if (!["DRAFT", "CANCELLED"].includes(count.status)) {
      throw new BadRequestException('Only DRAFT or CANCELLED counts can be deleted');
    }

    const docFullNo = count.doc_full_no;
    const previousStatus = count.status;

    await this.dataSource.query('DELETE FROM stock_count_items WHERE stock_count_id = $1', [id]);
    await this.dataSource.query('DELETE FROM stock_counts WHERE id = $1', [id]);

    await this.auditLogService.log({
      module: 'STOCK_COUNT',
      action: 'DELETE',
      documentId: id,
      documentNo: docFullNo,
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { previousStatus },
    });

    return { deleted: true };
  }
}
