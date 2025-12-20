import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GoodsReceiptItemEntity } from './goods-receipt-item.entity';

@Entity('goods_receipts')
export class GoodsReceiptEntity {
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

  // Link to PO and QT
  @Column({ name: 'purchase_order_id', nullable: true })
  purchaseOrderId: number;

  @Column({ name: 'purchase_order_doc_no', type: 'varchar', length: 25, nullable: true })
  purchaseOrderDocNo: string;

  @Column({ name: 'quotation_id', nullable: true })
  quotationId: number;

  @Column({ name: 'quotation_doc_no', type: 'varchar', length: 25, nullable: true })
  quotationDocNo: string;

  // Supplier
  @Column({ name: 'supplier_id' })
  supplierId: number;

  @Column({ name: 'supplier_name', type: 'varchar', length: 255, nullable: true })
  supplierName: string;

  // Warehouse
  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ name: 'warehouse_name', type: 'varchar', length: 100, nullable: true })
  warehouseName: string;

  // Dates
  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  @Column({ name: 'receive_date', type: 'date', nullable: true })
  receiveDate: Date;

  @Column({ name: 'supplier_invoice_no', type: 'varchar', length: 50, nullable: true })
  supplierInvoiceNo: string;

  @Column({ name: 'supplier_invoice_date', type: 'date', nullable: true })
  supplierInvoiceDate: Date;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string; // DRAFT, POSTED, CANCELLED

  // Amounts
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  subtotal: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalAmount: number;

  // Cost Variance Summary
  @Column({ name: 'total_expected_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalExpectedCost: number;

  @Column({ name: 'total_variance', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalVariance: number;

  @Column({ name: 'variance_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  variancePercent: number;

  @Column({ name: 'has_variance_alert', type: 'boolean', default: false })
  hasVarianceAlert: boolean;

  // Notes
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

  // Audit
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ name: 'reversed_from_id', nullable: true })
  reversedFromId: number;

  @Column({ name: 'reversed_to_id', nullable: true })
  reversedToId: number;

  @Column({ name: 'reversed_at', type: 'timestamptz', nullable: true })
  reversedAt: Date;

  @Column({ name: 'reversed_by', nullable: true })
  reversedBy: number;

  @Column({ name: 'reverse_reason', type: 'text', nullable: true })
  reverseReason: string;

  @OneToMany(() => GoodsReceiptItemEntity, item => item.goodsReceipt)
  items: GoodsReceiptItemEntity[];
}
