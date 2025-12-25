import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PaymentReceiptItemEntity } from './payment-receipt-item.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CHEQUE = 'CHEQUE',
  CREDIT_CARD = 'CREDIT_CARD',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

@Entity('payment_receipts')
export class PaymentReceiptEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'doc_no', type: 'varchar', length: 30, unique: true })
  docNo: string; // RC-YYYYMM-XXXX

  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  // Customer
  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'customer_code', type: 'varchar', length: 50 })
  customerCode: string;

  @Column({ name: 'customer_name', type: 'varchar', length: 200 })
  customerName: string;

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

  @Column({ name: 'cheque_bank', type: 'varchar', length: 100, nullable: true })
  chequeBank: string;

  @Column({ name: 'reference_no', type: 'varchar', length: 100, nullable: true })
  referenceNo: string; // เลขที่อ้างอิง/เลขที่โอน

  // Amounts
  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'withholding_tax', type: 'decimal', precision: 15, scale: 4, default: 0 })
  withholdingTax: number; // ภาษี ณ ที่จ่าย

  @Column({ name: 'net_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  netAmount: number; // ยอดรับจริง

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
  @OneToMany(() => PaymentReceiptItemEntity, item => item.paymentReceipt, { cascade: true })
  items: PaymentReceiptItemEntity[];
}
