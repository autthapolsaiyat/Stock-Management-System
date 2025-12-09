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

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ name: 'quotation_id', nullable: true })
  quotationId: number;

  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'credit_term_days', type: 'int', default: 30 })
  creditTermDays: number;

  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  subtotal: number;

  @Column({ name: 'discount_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountTotal: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 7 })
  taxRate: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  taxAmount: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  grandTotal: number;

  @Column({ name: 'cost_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  costTotal: number;

  @Column({ name: 'profit_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  profitTotal: number;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ name: 'posted_at', type: 'timestamptz', nullable: true })
  postedAt: Date;

  @Column({ name: 'posted_by', nullable: true })
  postedBy: number;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @OneToMany(() => SalesInvoiceItemEntity, item => item.salesInvoice)
  items: SalesInvoiceItemEntity[];
}
