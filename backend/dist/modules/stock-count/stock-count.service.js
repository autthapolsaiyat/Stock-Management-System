"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockCountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doc_numbering_service_1 = require("../doc-numbering/doc-numbering.service");
const stock_adjustment_service_1 = require("../stock-adjustment/stock-adjustment.service");
let StockCountService = class StockCountService {
    constructor(dataSource, docNumberingService, stockAdjustmentService) {
        this.dataSource = dataSource;
        this.docNumberingService = docNumberingService;
        this.stockAdjustmentService = stockAdjustmentService;
    }
    async findAll() {
        const result = await this.dataSource.query(`
      SELECT sc.*, 
        w.name as warehouse_name_ref,
        u.display_name as created_by_name
      FROM stock_counts sc
      LEFT JOIN warehouses w ON sc.warehouse_id = w.id
      LEFT JOIN users u ON sc.created_by = u.id
      WHERE sc.is_latest_revision = true
      ORDER BY sc.created_at DESC
    `);
        return result;
    }
    async findOne(id) {
        const [count] = await this.dataSource.query(`SELECT sc.*, w.name as warehouse_name_ref
       FROM stock_counts sc
       LEFT JOIN warehouses w ON sc.warehouse_id = w.id
       WHERE sc.id = $1`, [id]);
        if (!count) {
            throw new common_1.NotFoundException(`Stock Count #${id} not found`);
        }
        const items = await this.dataSource.query(`SELECT sci.*, p.code as product_code, p.name as product_name
       FROM stock_count_items sci
       LEFT JOIN products p ON sci.product_id = p.id
       WHERE sci.stock_count_id = $1
       ORDER BY sci.line_no`, [id]);
        return { ...count, items };
    }
    async create(dto, userId) {
        const { warehouseId, countDate, countType, categoryIds, description, remark } = dto;
        const [warehouse] = await this.dataSource.query('SELECT name FROM warehouses WHERE id = $1', [warehouseId]);
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
        const params = [warehouseId];
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
            description, products.length, remark, userId
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
        return this.findOne(result.id);
    }
    async startCount(id, userId) {
        const count = await this.findOne(id);
        if (count.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Can only start DRAFT counts');
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
    `, [id, userId]);
        return this.findOne(id);
    }
    async updateItemCount(id, itemId, dto, userId) {
        const { qtyCount1, qtyCount2, remark } = dto;
        const [item] = await this.dataSource.query('SELECT * FROM stock_count_items WHERE id = $1 AND stock_count_id = $2', [itemId, id]);
        if (!item) {
            throw new common_1.NotFoundException('Count item not found');
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
    `, [qtyCount1, qtyCount2, qtyFinal, qtyVariance, valueVariance, countStatus, userId, remark, itemId]);
        await this.updateHeaderCounts(id);
        return this.findOne(id);
    }
    async updateHeaderCounts(id) {
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
    async complete(id, userId) {
        const count = await this.findOne(id);
        if (count.status !== 'IN_PROGRESS') {
            throw new common_1.BadRequestException('Can only complete IN_PROGRESS counts');
        }
        const uncountedItems = count.items.filter(i => i.count_status === 'NOT_COUNTED');
        if (uncountedItems.length > 0) {
            throw new common_1.BadRequestException(`${uncountedItems.length} items are not counted yet`);
        }
        await this.dataSource.query(`
      UPDATE stock_counts 
      SET status = 'COMPLETED', completed_at = NOW(), updated_by = $2
      WHERE id = $1
    `, [id, userId]);
        return this.findOne(id);
    }
    async approve(id, userId) {
        const count = await this.findOne(id);
        if (count.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Can only approve COMPLETED counts');
        }
        await this.dataSource.query(`
      UPDATE stock_counts 
      SET status = 'APPROVED', approved_at = NOW(), approved_by = $2
      WHERE id = $1
    `, [id, userId]);
        return this.findOne(id);
    }
    async createAdjustment(id, userId) {
        const count = await this.findOne(id);
        if (count.status !== 'APPROVED') {
            throw new common_1.BadRequestException('Can only create adjustment from APPROVED counts');
        }
        const varianceItems = count.items.filter(i => Number(i.qty_variance) !== 0);
        if (varianceItems.length === 0) {
            throw new common_1.BadRequestException('No variance items to adjust');
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
        const adjustment = await this.stockAdjustmentService.create(adjustmentDto, userId);
        await this.dataSource.query(`
      UPDATE stock_counts 
      SET adjustment_id = $1, status = 'ADJUSTED', updated_by = $2
      WHERE id = $3
    `, [adjustment.id, userId, id]);
        return { count: await this.findOne(id), adjustment };
    }
    async delete(id) {
        const count = await this.findOne(id);
        if (count.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only DRAFT counts can be deleted');
        }
        await this.dataSource.query('DELETE FROM stock_count_items WHERE stock_count_id = $1', [id]);
        await this.dataSource.query('DELETE FROM stock_counts WHERE id = $1', [id]);
        return { deleted: true };
    }
};
exports.StockCountService = StockCountService;
exports.StockCountService = StockCountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        doc_numbering_service_1.DocNumberingService,
        stock_adjustment_service_1.StockAdjustmentService])
], StockCountService);
//# sourceMappingURL=stock-count.service.js.map