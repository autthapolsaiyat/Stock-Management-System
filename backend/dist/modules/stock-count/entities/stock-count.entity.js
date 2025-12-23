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
exports.StockCountEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_count_item_entity_1 = require("./stock-count-item.entity");
let StockCountEntity = class StockCountEntity {
};
exports.StockCountEntity = StockCountEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_base_no', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], StockCountEntity.prototype, "docBaseNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_revision', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "docRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_full_no', type: 'varchar', length: 25, unique: true }),
    __metadata("design:type", String)
], StockCountEntity.prototype, "docFullNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_latest_revision', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], StockCountEntity.prototype, "isLatestRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StockCountEntity.prototype, "warehouseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'count_date', type: 'date' }),
    __metadata("design:type", Date)
], StockCountEntity.prototype, "countDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'count_type', type: 'varchar', length: 20, default: 'FULL' }),
    __metadata("design:type", String)
], StockCountEntity.prototype, "countType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_ids', type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], StockCountEntity.prototype, "categoryIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StockCountEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'DRAFT' }),
    __metadata("design:type", String)
], StockCountEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_items', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "totalItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'counted_items', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "countedItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variance_items', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "varianceItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_variance_value', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "totalVarianceValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockCountEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adjustment_id', nullable: true }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "adjustmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockCountEntity.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockCountEntity.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockCountEntity.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockCountEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StockCountEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], StockCountEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_count_item_entity_1.StockCountItemEntity, item => item.stockCount),
    __metadata("design:type", Array)
], StockCountEntity.prototype, "items", void 0);
exports.StockCountEntity = StockCountEntity = __decorate([
    (0, typeorm_1.Entity)('stock_counts')
], StockCountEntity);
//# sourceMappingURL=stock-count.entity.js.map