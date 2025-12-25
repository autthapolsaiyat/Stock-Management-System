import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentReceiptEntity } from './payment-receipt.entity';

@Entity('payment_receipt_items')
export class PaymentReceiptItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_receipt_id' })
  paymentReceiptId: number;

  @ManyToOne(() => PaymentReceiptEntity, pr => pr.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_receipt_id' })
  paymentReceipt: PaymentReceiptEntity;

  @Column({ name: 'line_no', type: 'int' })
  lineNo: number;

  // Invoice reference
  @Column({ name: 'invoice_id' })
  invoiceId: number;

  @Column({ name: 'invoice_doc_no', type: 'varchar', length: 30 })
  invoiceDocNo: string;

  @Column({ name: 'invoice_date', type: 'date' })
  invoiceDate: Date;

  @Column({ name: 'invoice_due_date', type: 'date', nullable: true })
  invoiceDueDate: Date;

  // Amounts
  @Column({ name: 'invoice_amount', type: 'decimal', precision: 15, scale: 4 })
  invoiceAmount: number; // ยอดเต็มของ Invoice

  @Column({ name: 'outstanding_amount', type: 'decimal', precision: 15, scale: 4 })
  outstandingAmount: number; // ยอดค้างชำระก่อนรับเงิน

  @Column({ name: 'payment_amount', type: 'decimal', precision: 15, scale: 4 })
  paymentAmount: number; // ยอดที่รับชำระครั้งนี้

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number; // ส่วนลดเงินสด

  @Column({ name: 'withholding_tax', type: 'decimal', precision: 15, scale: 4, default: 0 })
  withholdingTax: number; // ภาษี ณ ที่จ่าย

  @Column({ name: 'net_amount', type: 'decimal', precision: 15, scale: 4 })
  netAmount: number; // ยอดรับจริง

  // Remaining after this payment
  @Column({ name: 'remaining_amount', type: 'decimal', precision: 15, scale: 4 })
  remainingAmount: number;

  @Column({ type: 'text', nullable: true })
  remark: string;
}
