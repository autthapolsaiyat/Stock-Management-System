import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum OutstandingType {
  AR = 'AR', // ลูกหนี้
  AP = 'AP', // เจ้าหนี้
}

export enum OutstandingStatus {
  OPEN = 'OPEN',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('ar_ap_outstanding')
export class ArApOutstandingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  type: OutstandingType; // AR or AP

  // Partner info
  @Column({ name: 'partner_id' })
  partnerId: number; // customer_id หรือ supplier_id

  @Column({ name: 'partner_code', type: 'varchar', length: 50 })
  partnerCode: string;

  @Column({ name: 'partner_name', type: 'varchar', length: 200 })
  partnerName: string;

  // Document reference
  @Column({ name: 'doc_type', type: 'varchar', length: 30 })
  docType: string; // SALES_INVOICE, GOODS_RECEIPT, CREDIT_NOTE

  @Column({ name: 'doc_id' })
  docId: number;

  @Column({ name: 'doc_no', type: 'varchar', length: 30 })
  docNo: string;

  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'credit_term_days', type: 'int', default: 0 })
  creditTermDays: number;

  // Amounts
  @Column({ name: 'original_amount', type: 'decimal', precision: 15, scale: 4 })
  originalAmount: number;

  @Column({ name: 'paid_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  paidAmount: number;

  @Column({ name: 'outstanding_amount', type: 'decimal', precision: 15, scale: 4 })
  outstandingAmount: number;

  // Discount & WHT
  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'withholding_tax', type: 'decimal', precision: 15, scale: 4, default: 0 })
  withholdingTax: number;

  // Status
  @Column({ type: 'varchar', length: 20, default: OutstandingStatus.OPEN })
  status: OutstandingStatus;

  // Last payment info
  @Column({ name: 'last_payment_date', type: 'date', nullable: true })
  lastPaymentDate: Date;

  @Column({ name: 'last_payment_amount', type: 'decimal', precision: 15, scale: 4, nullable: true })
  lastPaymentAmount: number;

  // Fully paid info
  @Column({ name: 'fully_paid_at', type: 'timestamptz', nullable: true })
  fullyPaidAt: Date;

  // Aging calculation helpers
  @Column({ name: 'days_overdue', type: 'int', default: 0 })
  daysOverdue: number;

  @Column({ name: 'aging_bucket', type: 'varchar', length: 20, nullable: true })
  agingBucket: string; // CURRENT, 1-30, 31-60, 61-90, 90+

  // Audit
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
