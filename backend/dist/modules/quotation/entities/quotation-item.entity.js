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
exports.QuotationItemEntity = void 0;
const typeorm_1 = require("typeorm");
const quotation_entity_1 = require("./quotation.entity");
let QuotationItemEntity = class QuotationItemEntity {
};
exports.QuotationItemEntity = QuotationItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_id' }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "quotationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no' }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_type', type: 'varchar', length: 10, default: 'MASTER' }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "sourceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temp_product_id', nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "tempProductId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "itemDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'ea' }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "estimatedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "discountPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_price', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "netPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'margin_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "marginAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'margin_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "marginPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_quoted', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "qtyQuoted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_ordered', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "qtyOrdered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_received', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "qtyReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_sold', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "qtySold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_cancelled', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "qtyCancelled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_remaining', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "qtyRemaining", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_status', type: 'varchar', length: 20, default: 'PENDING' }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "itemStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_cost', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "actualCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_margin_amount', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "actualMarginAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_margin_percent', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "actualMarginPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_variance_amount', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "costVarianceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_variance_percent', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "costVariancePercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoice_price', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "invoicePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_adjustment_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "priceAdjustmentReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_adjustment_approved_by', nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "priceAdjustmentApprovedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancel_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "cancelReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], QuotationItemEntity.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'public_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "publicNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationItemEntity.prototype, "internalNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'po_item_id', nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "poItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gr_item_id', nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "grItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoice_item_id', nullable: true }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "invoiceItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quotation_entity_1.QuotationEntity, quotation => quotation.items),
    (0, typeorm_1.JoinColumn)({ name: 'quotation_id' }),
    __metadata("design:type", quotation_entity_1.QuotationEntity)
], QuotationItemEntity.prototype, "quotation", void 0);
exports.QuotationItemEntity = QuotationItemEntity = __decorate([
    (0, typeorm_1.Entity)('quotation_items')
], QuotationItemEntity);
//# sourceMappingURL=quotation-item.entity.js.map