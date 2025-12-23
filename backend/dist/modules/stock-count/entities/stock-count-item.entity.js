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
exports.StockCountItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_count_entity_1 = require("./stock-count.entity");
let StockCountItemEntity = class StockCountItemEntity {
};
exports.StockCountItemEntity = StockCountItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_count_id' }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "stockCountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no', type: 'int' }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], StockCountItemEntity.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], StockCountItemEntity.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], StockCountItemEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], StockCountItemEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_system', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "qtySystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_count1', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "qtyCount1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_count2', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "qtyCount2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_final', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "qtyFinal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_variance', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "qtyVariance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_variance', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "valueVariance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'count_status', type: 'varchar', length: 20, default: 'NOT_COUNTED' }),
    __metadata("design:type", String)
], StockCountItemEntity.prototype, "countStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'counted_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockCountItemEntity.prototype, "countedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'counted_by', nullable: true }),
    __metadata("design:type", Number)
], StockCountItemEntity.prototype, "countedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockCountItemEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockCountItemEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StockCountItemEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_count_entity_1.StockCountEntity, count => count.items),
    (0, typeorm_1.JoinColumn)({ name: 'stock_count_id' }),
    __metadata("design:type", stock_count_entity_1.StockCountEntity)
], StockCountItemEntity.prototype, "stockCount", void 0);
exports.StockCountItemEntity = StockCountItemEntity = __decorate([
    (0, typeorm_1.Entity)('stock_count_items')
], StockCountItemEntity);
//# sourceMappingURL=stock-count-item.entity.js.map