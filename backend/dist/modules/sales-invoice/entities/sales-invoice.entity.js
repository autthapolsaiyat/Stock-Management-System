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
exports.SalesInvoiceEntity = void 0;
const typeorm_1 = require("typeorm");
const sales_invoice_item_entity_1 = require("./sales-invoice-item.entity");
let SalesInvoiceEntity = class SalesInvoiceEntity {
};
exports.SalesInvoiceEntity = SalesInvoiceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_base_no', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "docBaseNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_revision', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "docRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_full_no', type: 'varchar', length: 25, unique: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "docFullNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_latest_revision', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SalesInvoiceEntity.prototype, "isLatestRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_id', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "quotationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_doc_no', type: 'varchar', length: 25, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "quotationDocNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "customerAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "warehouseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_date', type: 'date' }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "docDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_term_days', type: 'int', default: 30 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "creditTermDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'DRAFT' }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "discountPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "discountTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'after_discount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "afterDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 7 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grand_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "grandTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "costTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profit_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "profitTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profit_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "profitPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_price_variance', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SalesInvoiceEntity.prototype, "hasPriceVariance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_variance_approved', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SalesInvoiceEntity.prototype, "priceVarianceApproved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_variance_approved_by', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "priceVarianceApprovedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_variance_approved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "priceVarianceApprovedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'public_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "publicNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "internalNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'posted_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "postedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'posted_by', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "postedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancel_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "cancelReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_by', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "paidBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_amount', type: 'decimal', precision: 15, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_reference', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SalesInvoiceEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_credit_note', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SalesInvoiceEntity.prototype, "hasCreditNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_note_id', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "creditNoteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_note_for_id', nullable: true }),
    __metadata("design:type", Number)
], SalesInvoiceEntity.prototype, "creditNoteForId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_note_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SalesInvoiceEntity.prototype, "creditNoteReason", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_invoice_item_entity_1.SalesInvoiceItemEntity, item => item.salesInvoice),
    __metadata("design:type", Array)
], SalesInvoiceEntity.prototype, "items", void 0);
exports.SalesInvoiceEntity = SalesInvoiceEntity = __decorate([
    (0, typeorm_1.Entity)('sales_invoices')
], SalesInvoiceEntity);
//# sourceMappingURL=sales-invoice.entity.js.map