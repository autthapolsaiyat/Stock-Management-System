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
exports.QuotationEntity = void 0;
const typeorm_1 = require("typeorm");
const quotation_item_entity_1 = require("./quotation-item.entity");
let QuotationEntity = class QuotationEntity {
};
exports.QuotationEntity = QuotationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_base_no', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "docBaseNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_revision', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "docRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_full_no', type: 'varchar', length: 25, unique: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "docFullNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_latest_revision', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], QuotationEntity.prototype, "isLatestRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qt_type', type: 'varchar', length: 20, default: 'STANDARD' }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "qtType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "customerAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_email', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_date', type: 'date' }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "docDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_until', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_validity_days', type: 'int', default: 30 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "priceValidityDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_days', type: 'int', default: 120 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "deliveryDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_term_days', type: 'int', default: 30 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "creditTermDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_terms_text', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "paymentTermsText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_terms', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "deliveryTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_person_id', nullable: true }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "salesPersonId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_person_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "salesPersonName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "discountPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'after_discount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "afterDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 7 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "taxRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grand_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "grandTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_estimated_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "totalEstimatedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_actual_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "totalActualCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_margin_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "expectedMarginPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_margin_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "actualMarginPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'DRAFT' }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approval_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "approvalNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requires_margin_approval', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], QuotationEntity.prototype, "requiresMarginApproval", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'margin_approved_by', nullable: true }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "marginApprovedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'margin_approved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "marginApprovedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'margin_approval_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "marginApprovalNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'public_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "publicNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "internalNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revision_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "revisionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revised_from_id', nullable: true }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "revisedFromId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmed_by', nullable: true }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "confirmedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancel_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "cancelReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_items', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "totalItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'items_sold', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "itemsSold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'items_partial', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "itemsPartial", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'items_cancelled', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "itemsCancelled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fulfillment_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "fulfillmentPercent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quotation_item_entity_1.QuotationItemEntity, item => item.quotation),
    __metadata("design:type", Array)
], QuotationEntity.prototype, "items", void 0);
exports.QuotationEntity = QuotationEntity = __decorate([
    (0, typeorm_1.Entity)('quotations')
], QuotationEntity);
//# sourceMappingURL=quotation.entity.js.map