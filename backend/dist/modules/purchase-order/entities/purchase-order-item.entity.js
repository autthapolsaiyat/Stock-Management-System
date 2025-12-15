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
exports.PurchaseOrderItemEntity = void 0;
const typeorm_1 = require("typeorm");
const purchase_order_entity_1 = require("./purchase-order.entity");
let PurchaseOrderItemEntity = class PurchaseOrderItemEntity {
};
exports.PurchaseOrderItemEntity = PurchaseOrderItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_order_id' }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no' }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_id', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "quotationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_item_id', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "quotationItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_type', type: 'varchar', length: 10, default: 'MASTER' }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "sourceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temp_product_id', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "tempProductId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "itemDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'ea' }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "discountPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_price', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "netPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_ordered', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "qtyOrdered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_received', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "qtyReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_remaining', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "qtyRemaining", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_status', type: 'varchar', length: 20, default: 'PENDING' }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "itemStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_unit_cost', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "actualUnitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "internalNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "supplierNote", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_entity_1.PurchaseOrderEntity, po => po.items),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_order_id' }),
    __metadata("design:type", purchase_order_entity_1.PurchaseOrderEntity)
], PurchaseOrderItemEntity.prototype, "purchaseOrder", void 0);
exports.PurchaseOrderItemEntity = PurchaseOrderItemEntity = __decorate([
    (0, typeorm_1.Entity)('purchase_order_items')
], PurchaseOrderItemEntity);
//# sourceMappingURL=purchase-order-item.entity.js.map