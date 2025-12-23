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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockAdjustmentItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_adjustment_entity_1 = require("./stock-adjustment.entity");
let StockAdjustmentItemEntity = class StockAdjustmentItemEntity {
};
exports.StockAdjustmentItemEntity = StockAdjustmentItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_adjustment_id' }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "stockAdjustmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no', type: 'int' }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentItemEntity.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], StockAdjustmentItemEntity.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentItemEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_system', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "qtySystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_counted', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "qtyCounted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_adjust', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "qtyAdjust", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_adjust', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "valueAdjust", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentItemEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockAdjustmentItemEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StockAdjustmentItemEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_adjustment_entity_1.StockAdjustmentEntity, adj => adj.items),
    (0, typeorm_1.JoinColumn)({ name: 'stock_adjustment_id' }),
    __metadata("design:type", stock_adjustment_entity_1.StockAdjustmentEntity)
], StockAdjustmentItemEntity.prototype, "stockAdjustment", void 0);
exports.StockAdjustmentItemEntity = StockAdjustmentItemEntity = __decorate([
    (0, typeorm_1.Entity)('stock_adjustment_items')
], StockAdjustmentItemEntity);
//# sourceMappingURL=stock-adjustment-item.entity.js.map