import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';

@Injectable()
export class StockAdjustmentService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private docNumberingService: DocNumberingService,
    private fifoService: FifoService,
  ) {}

  async findAll() {
    const result = await this.dataSource.query(`
      SELECT sa.*, 
        (SELECT COUNT(*) FROM stock_adjustment_items WHERE stock_adjustment_id = sa.id) as total_items,
        u.full_name as created_by_name
      FROM stock_adjustments sa
      LEFT JOIN users u ON sa.created_by = u.id
      WHERE sa.is_latest_revision = true
      ORDER BY sa.created_at DESC
    `);
    return result;
  }

  async findOne(id: number) {
    const [adjustment] = await this.dataSource.query(
      `SELECT sa.*, w.name as warehouse_name_ref
       FROM stock_adjustments sa
       LEFT JOIN warehouses w ON sa.warehouse_id = w.id
       WHERE sa.id = $1`,
      [id]
    );
    
    if (!adjustment) {
      throw new NotFoundException(`Stock Adjustment #${id} not found`);
    }

    const items = await this.dataSource.query(
      `SELECT sai.*, p.code as product_code, p.name as product_name
       FROM stock_adjustment_items sai
       LEFT JOIN products p ON sai.product_id = p.id
       WHERE sai.stock_adjustment_id = $1
       ORDER BY sai.line_no`,
      [id]
    );

    return { ...adjustment, items };
  }

  async create(dto: any, userId?: number) {
    const { warehouseId, docDate, adjustmentType, reason, remark, items } = dto;

    // Get warehouse name
    const [warehouse] = await this.dataSource.query(
      'SELECT name FROM warehouses WHERE id = $1',
      [warehouseId]
    );

    // Generate document number
    const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('ADJ');

    // Calculate totals
    let totalQtyAdjust = 0;
    let totalValueAdjust = 0;

    const processedItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Get current stock info
      const [stockInfo] = await this.dataSource.query(`
        SELECT sb.qty_on_hand, sb.avg_cost, p.code, p.name, u.name as unit_name
        FROM stock_balances sb
        JOIN products p ON sb.product_id = p.id
        LEFT JOIN units u ON p.unit_id = u.id
        WHERE sb.product_id = $1 AND sb.warehouse_id = $2
      `, [item.productId, warehouseId]);

      const qtySystem = Number(stockInfo?.qty_on_hand || 0);
      const unitCost = Number(item.unitCost || stockInfo?.avg_cost || 0);
      
      let qtyAdjust = 0;
      if (adjustmentType === 'ADJ_IN') {
        qtyAdjust = Math.abs(Number(item.qtyAdjust || 0));
      } else if (adjustmentType === 'ADJ_OUT') {
        qtyAdjust = -Math.abs(Number(item.qtyAdjust || 0));
      } else { // ADJ_COUNT
        const qtyCounted = Number(item.qtyCounted || 0);
        qtyAdjust = qtyCounted - qtySystem;
      }

      const valueAdjust = qtyAdjust * unitCost;
      totalQtyAdjust += qtyAdjust;
      totalValueAdjust += valueAdjust;

      processedItems.push({
        lineNo: i + 1,
        productId: item.productId,
        itemCode: stockInfo?.code || item.itemCode,
        itemName: stockInfo?.name || item.itemName,
        unit: stockInfo?.unit_name || item.unit,
        qtySystem,
        qtyCounted: item.qtyCounted || 0,
        qtyAdjust,
        unitCost,
        valueAdjust,
        remark: item.remark,
      });
    }

    // Insert header
    const [result] = await this.dataSource.query(`
      INSERT INTO stock_adjustments (
        doc_base_no, doc_revision, doc_full_no, is_latest_revision,
        warehouse_id, warehouse_name, doc_date, adjustment_type,
        reason, status, total_qty_adjust, total_value_adjust,
        remark, created_by
      ) VALUES ($1, 1, $2, true, $3, $4, $5, $6, $7, 'DRAFT', $8, $9, $10, $11)
      RETURNING id
    `, [
      docBaseNo, docFullNo, warehouseId, warehouse?.name, docDate,
      adjustmentType, reason, totalQtyAdjust, totalValueAdjust,
      remark, userId
    ]);

    // Insert items
    for (const item of processedItems) {
      await this.dataSource.query(`
        INSERT INTO stock_adjustment_items (
          stock_adjustment_id, line_no, product_id, item_code, item_name,
          unit, qty_system, qty_counted, qty_adjust, unit_cost, value_adjust, remark
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        result.id, item.lineNo, item.productId, item.itemCode, item.itemName,
        item.unit, item.qtySystem, item.qtyCounted, item.qtyAdjust,
        item.unitCost, item.valueAdjust, item.remark
      ]);
    }

    return this.findOne(result.id);
  }

  async post(id: number, userId?: number) {
    const adjustment = await this.findOne(id);

    if (adjustment.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT adjustments can be posted');
    }

    // Process each item
    for (const item of adjustment.items) {
      const qtyAdjust = Number(item.qty_adjust || item.qtyAdjust);
      const productId = item.product_id || item.productId;
      const warehouseId = adjustment.warehouse_id || adjustment.warehouseId;
      const unitCost = Number(item.unit_cost || item.unitCost);
      const docFullNo = adjustment.doc_full_no || adjustment.docFullNo;
      
      if (qtyAdjust > 0) {
        // Add stock - create FIFO layer
        await this.fifoService.createLayer({
          productId,
          warehouseId,
          qty: qtyAdjust,
          unitCost,
          referenceType: 'ADJ',
          referenceId: id,
        });
      } else if (qtyAdjust < 0) {
        // Reduce stock - deduct from FIFO
        await this.fifoService.deductFifo(
          productId,
          warehouseId,
          Math.abs(qtyAdjust),
          'ADJ',
          id
        );
      }
    }

    // Update status
    await this.dataSource.query(`
      UPDATE stock_adjustments 
      SET status = 'POSTED', posted_at = NOW(), posted_by = $2
      WHERE id = $1
    `, [id, userId]);

    return this.findOne(id);
  }

  async cancel(id: number, userId?: number) {
    const adjustment = await this.findOne(id);

    if (adjustment.status === 'CANCELLED') {
      throw new BadRequestException('Adjustment is already cancelled');
    }

    if (adjustment.status === 'POSTED') {
      // Reverse the stock changes
      for (const item of adjustment.items) {
        const qtyAdjust = Number(item.qty_adjust || item.qtyAdjust);
        const productId = item.product_id || item.productId;
        const warehouseId = adjustment.warehouse_id || adjustment.warehouseId;
        const unitCost = Number(item.unit_cost || item.unitCost);
        
        if (qtyAdjust > 0) {
          // Was added, now deduct
          await this.fifoService.deductFifo(
            productId,
            warehouseId,
            qtyAdjust,
            'ADJ_REV',
            id
          );
        } else if (qtyAdjust < 0) {
          // Was deducted, now add back
          await this.fifoService.createLayer({
            productId,
            warehouseId,
            qty: Math.abs(qtyAdjust),
            unitCost,
            referenceType: 'ADJ_REV',
            referenceId: id,
          });
        }
      }
    }

    await this.dataSource.query(`
      UPDATE stock_adjustments 
      SET status = 'CANCELLED', cancelled_at = NOW(), cancelled_by = $2
      WHERE id = $1
    `, [id, userId]);

    return this.findOne(id);
  }

  async delete(id: number) {
    const adjustment = await this.findOne(id);

    if (adjustment.status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT adjustments can be deleted');
    }

    await this.dataSource.query('DELETE FROM stock_adjustment_items WHERE stock_adjustment_id = $1', [id]);
    await this.dataSource.query('DELETE FROM stock_adjustments WHERE id = $1', [id]);

    return { deleted: true };
  }

  // Get products for adjustment (with current stock)
  async getProductsForAdjustment(warehouseId: number) {
    const result = await this.dataSource.query(`
      SELECT 
        p.id, p.code, p.name, 
        u.name as unit,
        COALESCE(sb.qty_on_hand, 0) as qty_on_hand,
        COALESCE(sb.avg_cost, p.standard_cost, 0) as avg_cost
      FROM products p
      LEFT JOIN units u ON p.unit_id = u.id
      LEFT JOIN stock_balances sb ON p.id = sb.product_id AND sb.warehouse_id = $1
      WHERE p.is_active = true
      ORDER BY p.code
    `, [warehouseId]);
    
    return result;
  }
}
