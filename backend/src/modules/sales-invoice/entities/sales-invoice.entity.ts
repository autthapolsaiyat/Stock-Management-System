import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SalesInvoiceItemEntity } from './sales-invoice-item.entity';

@Entity('sales_invoices')
export class SalesInvoiceEntity {
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

  // Link to Quotation
  @Column({ name: 'quotation_id', nullable: true })
  quotationId: number;

  @Column({ name: 'quotation_doc_no', type: 'varchar', length: 25, nullable: true })
  quotationDocNo: string;

  // Customer
  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'customer_name', type: 'varchar', length: 255, nullable: true })
  customerName: string;

  @Column({ name: 'customer_tax_id', type: 'varchar', length: 20, nullable: true })
  customerTaxId: string;

  @Column({ name: 'customer_address', type: 'text', nullable: true })
  customerAddress: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 100, nullable: true })
  contactPerson: string;

  // Warehouse
  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ name: 'warehouse_name', type: 'varchar', length: 100, nullable: true })
  warehouseName: string;

  // Dates
  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'credit_term_days', type: 'int', default: 30 })
  creditTermDays: number;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string; // DRAFT, POSTED, CANCELLED

  // Amounts
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  subtotal: number;

  @Column({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ name: 'discount_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountTotal: number;

  @Column({ name: 'after_discount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  afterDiscount: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 7 })
  taxRate: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  taxAmount: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  grandTotal: number;

  // Cost & Profit
  @Column({ name: 'cost_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  costTotal: number;

  @Column({ name: 'profit_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  profitTotal: number;

  @Column({ name: 'profit_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  profitPercent: number;

  // Price Variance from Quotation
  @Column({ name: 'has_price_variance', type: 'boolean', default: false })
  hasPriceVariance: boolean;

  @Column({ name: 'price_variance_approved', type: 'boolean', default: false })
  priceVarianceApproved: boolean;

  @Column({ name: 'price_variance_approved_by', nullable: true })
  priceVarianceApprovedBy: number;

  @Column({ name: 'price_variance_approved_at', type: 'timestamptz', nullable: true })
  priceVarianceApprovedAt: Date;

  // Notes
  @Column({ name: 'public_note', type: 'text', nullable: true })
  publicNote: string;

  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  // Posting
  @Column({ name: 'posted_at', type: 'timestamptz', nullable: true })
  postedAt: Date;

  @Column({ name: 'posted_by', nullable: true })
  postedBy: number;

  // Cancellation
  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: number;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string;

  // Payment
  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date;

  @Column({ name: 'paid_by', nullable: true })
  paidBy: number;

  @Column({ name: 'paid_amount', type: 'decimal', precision: 15, scale: 4, nullable: true })
  paidAmount: number;

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  paymentMethod: string;

  @Column({ name: 'payment_reference', type: 'varchar', length: 100, nullable: true })
  paymentReference: string;

  // Audit
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  // Credit Note fields
  @Column({ name: 'has_credit_note', type: 'boolean', default: false })
  hasCreditNote: boolean;

  @Column({ name: 'credit_note_id', nullable: true })
  creditNoteId: number;

  @Column({ name: 'credit_note_for_id', nullable: true })
  creditNoteForId: number;

  @Column({ name: 'credit_note_reason', type: 'text', nullable: true })
  creditNoteReason: string;

  @OneToMany(() => SalesInvoiceItemEntity, item => item.salesInvoice)
  items: SalesInvoiceItemEntity[];
}
