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
exports.StockAdjustmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doc_numbering_service_1 = require("../doc-numbering/doc-numbering.service");
const fifo_service_1 = require("../fifo/fifo.service");
let StockAdjustmentService = class StockAdjustmentService {
    constructor(dataSource, docNumberingService, fifoService) {
        this.dataSource = dataSource;
        this.docNumberingService = docNumberingService;
        this.fifoService = fifoService;
    }
    async findAll() {
        const result = await this.dataSource.query(`
      SELECT sa.*, 
        (SELECT COUNT(*) FROM stock_adjustment_items WHERE stock_adjustment_id = sa.id) as total_items,
        u.display_name as created_by_name
      FROM stock_adjustments sa
      LEFT JOIN users u ON sa.created_by = u.id
      WHERE sa.is_latest_revision = true
      ORDER BY sa.created_at DESC
    `);
        return result;
    }
    async findOne(id) {
        const [adjustment] = await this.dataSource.query(`SELECT sa.*, w.name as warehouse_name_ref
       FROM stock_adjustments sa
       LEFT JOIN warehouses w ON sa.warehouse_id = w.id
       WHERE sa.id = $1`, [id]);
        if (!adjustment) {
            throw new common_1.NotFoundException(`Stock Adjustment #${id} not found`);
        }
        const items = await this.dataSource.query(`SELECT sai.*, p.code as product_code, p.name as product_name
       FROM stock_adjustment_items sai
       LEFT JOIN products p ON sai.product_id = p.id
       WHERE sai.stock_adjustment_id = $1
       ORDER BY sai.line_no`, [id]);
        return { ...adjustment, items };
    }
    async create(dto, userId) {
        const { warehouseId, docDate, adjustmentType, reason, remark, items } = dto;
        const [warehouse] = await this.dataSource.query('SELECT name FROM warehouses WHERE id = $1', [warehouseId]);
        const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('ADJ');
        let totalQtyAdjust = 0;
        let totalValueAdjust = 0;
        const processedItems = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
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
            }
            else if (adjustmentType === 'ADJ_OUT') {
                qtyAdjust = -Math.abs(Number(item.qtyAdjust || 0));
            }
            else {
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
    async post(id, userId) {
        const adjustment = await this.findOne(id);
        if (adjustment.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only DRAFT adjustments can be posted');
        }
        for (const item of adjustment.items) {
            const qtyAdjust = Number(item.qty_adjust || item.qtyAdjust);
            const productId = item.product_id || item.productId;
            const warehouseId = adjustment.warehouse_id || adjustment.warehouseId;
            const unitCost = Number(item.unit_cost || item.unitCost);
            const docFullNo = adjustment.doc_full_no || adjustment.docFullNo;
            if (qtyAdjust > 0) {
                await this.fifoService.createLayer({
                    productId,
                    warehouseId,
                    qty: qtyAdjust,
                    unitCost,
                    referenceType: 'ADJ',
                    referenceId: id,
                });
            }
            else if (qtyAdjust < 0) {
                await this.fifoService.deductFifo(productId, warehouseId, Math.abs(qtyAdjust), 'ADJ', id);
            }
        }
        await this.dataSource.query(`
      UPDATE stock_adjustments 
      SET status = 'POSTED', posted_at = NOW(), posted_by = $2
      WHERE id = $1
    `, [id, userId]);
        return this.findOne(id);
    }
    async cancel(id, userId) {
        const adjustment = await this.findOne(id);
        if (adjustment.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Adjustment is already cancelled');
        }
        if (adjustment.status === 'POSTED') {
            for (const item of adjustment.items) {
                const qtyAdjust = Number(item.qty_adjust || item.qtyAdjust);
                const productId = item.product_id || item.productId;
                const warehouseId = adjustment.warehouse_id || adjustment.warehouseId;
                const unitCost = Number(item.unit_cost || item.unitCost);
                if (qtyAdjust > 0) {
                    await this.fifoService.deductFifo(productId, warehouseId, qtyAdjust, 'ADJ_REV', id);
                }
                else if (qtyAdjust < 0) {
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
    async delete(id) {
        const adjustment = await this.findOne(id);
        if (adjustment.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only DRAFT adjustments can be deleted');
        }
        await this.dataSource.query('DELETE FROM stock_adjustment_items WHERE stock_adjustment_id = $1', [id]);
        await this.dataSource.query('DELETE FROM stock_adjustments WHERE id = $1', [id]);
        return { deleted: true };
    }
    async getProductsForAdjustment(warehouseId) {
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
};
exports.StockAdjustmentService = StockAdjustmentService;
exports.StockAdjustmentService = StockAdjustmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        doc_numbering_service_1.DocNumberingService,
        fifo_service_1.FifoService])
], StockAdjustmentService);
//# sourceMappingURL=stock-adjustment.service.js.map