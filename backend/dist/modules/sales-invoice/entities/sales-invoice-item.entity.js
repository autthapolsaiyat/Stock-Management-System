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
exports.SalesInvoiceItemEntity = void 0;
const typeorm_1 = require("typeorm");
const sales_invoice_entity_1 = require("./sales-invoice.entity");
let SalesInvoiceItemEntity = class SalesInvoiceItemEntity {
};
exports.SalesInvoiceItemEntity = SalesInvoiceItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_invoice_id' }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "salesInvoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no' }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_item_id', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "quotationItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "itemDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'ea' }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "discountPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_price', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "netPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "costTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profit_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "profitAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profit_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "profitPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quoted_price', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "quotedPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_variance', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "priceVariance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_variance_percent', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceItemEntity.prototype, "priceVariancePercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_price_variance', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SalesInvoiceItemEntity.prototype, "hasPriceVariance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_adjustment_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "priceAdjustmentReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceItemEntity.prototype, "internalNote", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_invoice_entity_1.SalesInvoiceEntity, invoice => invoice.items),
    (0, typeorm_1.JoinColumn)({ name: 'sales_invoice_id' }),
    __metadata("design:type", sales_invoice_entity_1.SalesInvoiceEntity)
], SalesInvoiceItemEntity.prototype, "salesInvoice", void 0);
exports.SalesInvoiceItemEntity = SalesInvoiceItemEntity = __decorate([
    (0, typeorm_1.Entity)('sales_invoice_items')
], SalesInvoiceItemEntity);
//# sourceMappingURL=sales-invoice-item.entity.js.map