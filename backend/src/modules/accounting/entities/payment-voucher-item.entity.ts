import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentVoucherEntity } from './payment-voucher.entity';

@Entity('payment_voucher_items')
export class PaymentVoucherItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_voucher_id' })
  paymentVoucherId: number;

  @ManyToOne(() => PaymentVoucherEntity, pv => pv.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_voucher_id' })
  paymentVoucher: PaymentVoucherEntity;

  @Column({ name: 'line_no', type: 'int' })
  lineNo: number;

  // Reference type: GR or direct expense
  @Column({ name: 'reference_type', type: 'varchar', length: 20 })
  referenceType: string; // GOODS_RECEIPT, PURCHASE_ORDER, EXPENSE

  @Column({ name: 'reference_id' })
  referenceId: number;

  @Column({ name: 'reference_doc_no', type: 'varchar', length: 30 })
  referenceDocNo: string;

  @Column({ name: 'reference_date', type: 'date' })
  referenceDate: Date;

  @Column({ name: 'reference_due_date', type: 'date', nullable: true })
  referenceDueDate: Date;

  // Amounts
  @Column({ name: 'reference_amount', type: 'decimal', precision: 15, scale: 4 })
  referenceAmount: number; // ยอดเต็มของ GR/PO

  @Column({ name: 'outstanding_amount', type: 'decimal', precision: 15, scale: 4 })
  outstandingAmount: number; // ยอดค้างชำระก่อนจ่าย

  @Column({ name: 'payment_amount', type: 'decimal', precision: 15, scale: 4 })
  paymentAmount: number; // ยอดที่จ่ายครั้งนี้

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'withholding_tax', type: 'decimal', precision: 15, scale: 4, default: 0 })
  withholdingTax: number;

  @Column({ name: 'net_amount', type: 'decimal', precision: 15, scale: 4 })
  netAmount: number;

  @Column({ name: 'remaining_amount', type: 'decimal', precision: 15, scale: 4 })
  remainingAmount: number;

  @Column({ type: 'text', nullable: true })
  remark: string;
}
