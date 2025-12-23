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
exports.StockAdjustmentEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_adjustment_item_entity_1 = require("./stock-adjustment-item.entity");
let StockAdjustmentEntity = class StockAdjustmentEntity {
};
exports.StockAdjustmentEntity = StockAdjustmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_base_no', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], StockAdjustmentEntity.prototype, "docBaseNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_revision', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "docRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_full_no', type: 'varchar', length: 25, unique: true }),
    __metadata("design:type", String)
], StockAdjustmentEntity.prototype, "docFullNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_latest_revision', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], StockAdjustmentEntity.prototype, "isLatestRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentEntity.prototype, "warehouseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_date', type: 'date' }),
    __metadata("design:type", Date)
], StockAdjustmentEntity.prototype, "docDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adjustment_type', type: 'varchar', length: 20, default: 'ADJ_COUNT' }),
    __metadata("design:type", String)
], StockAdjustmentEntity.prototype, "adjustmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentEntity.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'DRAFT' }),
    __metadata("design:type", String)
], StockAdjustmentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_qty_adjust', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "totalQtyAdjust", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_value_adjust', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "totalValueAdjust", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockAdjustmentEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_count_id', nullable: true }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "stockCountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'posted_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockAdjustmentEntity.prototype, "postedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'posted_by', nullable: true }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "postedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockAdjustmentEntity.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockAdjustmentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StockAdjustmentEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], StockAdjustmentEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_adjustment_item_entity_1.StockAdjustmentItemEntity, item => item.stockAdjustment),
    __metadata("design:type", Array)
], StockAdjustmentEntity.prototype, "items", void 0);
exports.StockAdjustmentEntity = StockAdjustmentEntity = __decorate([
    (0, typeorm_1.Entity)('stock_adjustments')
], StockAdjustmentEntity);
//# sourceMappingURL=stock-adjustment.entity.js.map