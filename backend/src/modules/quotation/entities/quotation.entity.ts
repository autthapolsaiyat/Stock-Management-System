import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { QuotationItemEntity } from './quotation-item.entity';

@Entity('quotations')
export class QuotationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'doc_base_no', type: 'varchar', length: 20 })
  docBaseNo: string;

  @Column({ name: 'doc_revision', type: 'int', default: 1 })
  docRevision: number;

  @Column({ name: 'doc_full_no', type: 'varchar', length: 25, unique: true })
  docFullNo: string;

  @Column({ name: 'is_latest_revision', type: 'boolean', default: true })
  isLatestRevision: boolean;

  // ประเภทใบเสนอราคา
  @Column({ name: 'qt_type', type: 'varchar', length: 20, default: 'STANDARD' })
  qtType: string; // STANDARD, FORENSIC, MAINTENANCE

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'customer_name', type: 'varchar', length: 255, nullable: true })
  customerName: string;

  @Column({ name: 'customer_address', type: 'text', nullable: true })
  customerAddress: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 100, nullable: true })
  contactPerson: string;

  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: Date;

  @Column({ name: 'price_validity_days', type: 'int', default: 30 })
  priceValidityDays: number;

  @Column({ name: 'delivery_days', type: 'int', default: 120 })
  deliveryDays: number;

  @Column({ name: 'credit_term_days', type: 'int', default: 30 })
  creditTermDays: number;

  @Column({ name: 'payment_terms_text', type: 'text', nullable: true })
  paymentTermsText: string;

  @Column({ name: 'delivery_terms', type: 'text', nullable: true })
  deliveryTerms: string;

  // Sales Person
  @Column({ name: 'sales_person_id', nullable: true })
  salesPersonId: number;

  @Column({ name: 'sales_person_name', type: 'varchar', length: 100, nullable: true })
  salesPersonName: string;

  // ยอดเงิน
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  subtotal: number;

  @Column({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'after_discount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  afterDiscount: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 7 })
  taxRate: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  taxAmount: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  grandTotal: number;

  // Margin Analysis (Internal)
  @Column({ name: 'total_estimated_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalEstimatedCost: number;

  @Column({ name: 'total_actual_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalActualCost: number;

  @Column({ name: 'expected_margin_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  expectedMarginPercent: number;

  @Column({ name: 'actual_margin_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  actualMarginPercent: number;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string; // DRAFT, PENDING_APPROVAL, APPROVED, SENT, PARTIALLY_CLOSED, CLOSED, CANCELLED

  // Approval
  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @Column({ name: 'approval_note', type: 'text', nullable: true })
  approvalNote: string;

  // Low Margin Approval
  @Column({ name: 'requires_margin_approval', type: 'boolean', default: false })
  requiresMarginApproval: boolean;

  @Column({ name: 'margin_approved_by', nullable: true })
  marginApprovedBy: number;

  @Column({ name: 'margin_approved_at', type: 'timestamptz', nullable: true })
  marginApprovedAt: Date;

  @Column({ name: 'margin_approval_note', type: 'text', nullable: true })
  marginApprovalNote: string;

  // Notes
  @Column({ name: 'public_note', type: 'text', nullable: true })
  publicNote: string;

  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ name: 'revision_reason', type: 'text', nullable: true })
  revisionReason: string;

  // Confirmation
  @Column({ name: 'confirmed_at', type: 'timestamptz', nullable: true })
  confirmedAt: Date;

  @Column({ name: 'confirmed_by', nullable: true })
  confirmedBy: number;

  // Cancellation
  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: number;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string;

  // Fulfillment Summary
  @Column({ name: 'total_items', type: 'int', default: 0 })
  totalItems: number;

  @Column({ name: 'items_sold', type: 'int', default: 0 })
  itemsSold: number;

  @Column({ name: 'items_partial', type: 'int', default: 0 })
  itemsPartial: number;

  @Column({ name: 'items_cancelled', type: 'int', default: 0 })
  itemsCancelled: number;

  @Column({ name: 'fulfillment_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  fulfillmentPercent: number;

  // Audit
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @OneToMany(() => QuotationItemEntity, item => item.quotation)
  items: QuotationItemEntity[];
}
