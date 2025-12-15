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
exports.GoodsReceiptItemEntity = void 0;
const typeorm_1 = require("typeorm");
const goods_receipt_entity_1 = require("./goods-receipt.entity");
let GoodsReceiptItemEntity = class GoodsReceiptItemEntity {
};
exports.GoodsReceiptItemEntity = GoodsReceiptItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'goods_receipt_id' }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "goodsReceiptId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no' }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'po_item_id', nullable: true }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "poItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_item_id', nullable: true }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "quotationItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_type', type: 'varchar', length: 10, default: 'MASTER' }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "sourceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', nullable: true }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temp_product_id', nullable: true }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "tempProductId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "itemDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'ea' }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_unit_cost', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "expectedUnitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_variance', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "costVariance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variance_percent', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "variancePercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_variance_alert', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], GoodsReceiptItemEntity.prototype, "hasVarianceAlert", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lot_no', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "lotNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiry_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], GoodsReceiptItemEntity.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "locationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "internalNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activated_product_id', nullable: true }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "activatedProductId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => goods_receipt_entity_1.GoodsReceiptEntity, grn => grn.items),
    (0, typeorm_1.JoinColumn)({ name: 'goods_receipt_id' }),
    __metadata("design:type", goods_receipt_entity_1.GoodsReceiptEntity)
], GoodsReceiptItemEntity.prototype, "goodsReceipt", void 0);
exports.GoodsReceiptItemEntity = GoodsReceiptItemEntity = __decorate([
    (0, typeorm_1.Entity)('goods_receipt_items')
], GoodsReceiptItemEntity);
//# sourceMappingURL=goods-receipt-item.entity.js.map