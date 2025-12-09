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
exports.PurchaseOrderEntity = void 0;
const typeorm_1 = require("typeorm");
const purchase_order_item_entity_1 = require("./purchase-order-item.entity");
let PurchaseOrderEntity = class PurchaseOrderEntity {
};
exports.PurchaseOrderEntity = PurchaseOrderEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_base_no', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "docBaseNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_revision', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "docRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_full_no', type: 'varchar', length: 25, unique: true }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "docFullNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_latest_revision', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PurchaseOrderEntity.prototype, "isLatestRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_date', type: 'date' }),
    __metadata("design:type", Date)
], PurchaseOrderEntity.prototype, "docDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrderEntity.prototype, "deliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_term_days', type: 'int', default: 30 }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "paymentTermDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'DRAFT' }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "discountTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 7 }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grand_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "grandTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrderEntity.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrderEntity.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PurchaseOrderEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PurchaseOrderEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrderEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_order_item_entity_1.PurchaseOrderItemEntity, item => item.purchaseOrder),
    __metadata("design:type", Array)
], PurchaseOrderEntity.prototype, "items", void 0);
exports.PurchaseOrderEntity = PurchaseOrderEntity = __decorate([
    (0, typeorm_1.Entity)('purchase_orders')
], PurchaseOrderEntity);
//# sourceMappingURL=purchase-order.entity.js.map