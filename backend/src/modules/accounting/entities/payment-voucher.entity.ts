import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PaymentVoucherItemEntity } from './payment-voucher-item.entity';
import { PaymentMethod, PaymentStatus } from './payment-receipt.entity';

@Entity('payment_vouchers')
export class PaymentVoucherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'doc_no', type: 'varchar', length: 30, unique: true })
  docNo: string; // PV-YYYYMM-XXXX

  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  // Supplier
  @Column({ name: 'supplier_id' })
  supplierId: number;

  @Column({ name: 'supplier_code', type: 'varchar', length: 50 })
  supplierCode: string;

  @Column({ name: 'supplier_name', type: 'varchar', length: 200 })
  supplierName: string;

  // Payment details
  @Column({ name: 'payment_method', type: 'varchar', length: 20 })
  paymentMethod: PaymentMethod;

  @Column({ name: 'bank_account_id', nullable: true })
  bankAccountId: number;

  @Column({ name: 'bank_account_name', type: 'varchar', length: 200, nullable: true })
  bankAccountName: string;

  @Column({ name: 'cheque_no', type: 'varchar', length: 50, nullable: true })
  chequeNo: string;

  @Column({ name: 'cheque_date', type: 'date', nullable: true })
  chequeDate: Date;

  @Column({ name: 'reference_no', type: 'varchar', length: 100, nullable: true })
  referenceNo: string;

  // Amounts
  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'withholding_tax', type: 'decimal', precision: 15, scale: 4, default: 0 })
  withholdingTax: number;

  @Column({ name: 'net_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  netAmount: number;

  // Status
  @Column({ type: 'varchar', length: 20, default: PaymentStatus.DRAFT })
  status: PaymentStatus;

  // Journal Entry link
  @Column({ name: 'journal_entry_id', nullable: true })
  journalEntryId: number;

  @Column({ name: 'journal_doc_no', type: 'varchar', length: 30, nullable: true })
  journalDocNo: string;

  // Notes
  @Column({ type: 'text', nullable: true })
  remark: string;

  // Posting info
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
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  // Relations
  @OneToMany(() => PaymentVoucherItemEntity, item => item.paymentVoucher, { cascade: true })
  items: PaymentVoucherItemEntity[];
}
