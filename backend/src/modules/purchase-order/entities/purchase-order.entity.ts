import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseOrderItemEntity } from './purchase-order-item.entity';

@Entity('purchase_orders')
export class PurchaseOrderEntity {
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

  // Supplier
  @Column({ name: 'supplier_id' })
  supplierId: number;

  @Column({ name: 'supplier_name', type: 'varchar', length: 255, nullable: true })
  supplierName: string;

  @Column({ name: 'supplier_tax_id', type: 'varchar', length: 20, nullable: true })
  supplierTaxId: string;

  @Column({ name: 'supplier_address', type: 'text', nullable: true })
  supplierAddress: string;

  @Column({ name: 'supplier_phone', type: 'varchar', length: 50, nullable: true })
  supplierPhone: string;

  @Column({ name: 'supplier_email', type: 'varchar', length: 200, nullable: true })
  supplierEmail: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 100, nullable: true })
  contactPerson: string;

  // Dates
  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  @Column({ name: 'delivery_date', type: 'date', nullable: true })
  deliveryDate: Date;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ name: 'payment_term_days', type: 'int', default: 30 })
  paymentTermDays: number;

  @Column({ name: 'payment_terms_text', type: 'text', nullable: true })
  paymentTermsText: string;

  @Column({ name: 'delivery_terms', type: 'text', nullable: true })
  deliveryTerms: string;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string; // DRAFT, PENDING_APPROVAL, APPROVED, SENT, PARTIAL_RECEIVED, RECEIVED, CANCELLED

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

  // Notes
  @Column({ name: 'public_note', type: 'text', nullable: true })
  publicNote: string;

  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  // Fulfillment
  @Column({ name: 'total_items', type: 'int', default: 0 })
  totalItems: number;

  @Column({ name: 'items_received', type: 'int', default: 0 })
  itemsReceived: number;

  @Column({ name: 'items_partial', type: 'int', default: 0 })
  itemsPartial: number;

  @Column({ name: 'receive_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  receivePercent: number;

  // Approval
  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @Column({ name: 'approval_note', type: 'text', nullable: true })
  approvalNote: string;

  // Cancellation
  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: number;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string;

  // Audit
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;


  // International PO Fields
  @Column({ name: 'is_international', type: 'boolean', default: false })
  isInternational: boolean;

  @Column({ name: 'vendor_attention', type: 'varchar', length: 100, nullable: true })
  vendorAttention: string;

  @Column({ name: 'vendor_fax', type: 'varchar', length: 50, nullable: true })
  vendorFax: string;

  @Column({ name: 'end_user', type: 'varchar', length: 255, nullable: true })
  endUser: string;

  @Column({ name: 'delivery_time', type: 'varchar', length: 100, nullable: true })
  deliveryTime: string;

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  paymentMethod: string;

  @Column({ name: 'shipping_instruction', type: 'varchar', length: 100, nullable: true })
  shippingInstruction: string;

  @Column({ type: 'varchar', length: 10, default: 'THB' })
  currency: string;

  @Column({ name: 'exchange_rate', type: 'decimal', precision: 10, scale: 4, default: 1 })
  exchangeRate: number;
  @OneToMany(() => PurchaseOrderItemEntity, item => item.purchaseOrder)
  items: PurchaseOrderItemEntity[];
}
