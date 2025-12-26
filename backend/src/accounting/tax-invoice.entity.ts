import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('tax_invoices')
export class TaxInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'doc_no', length: 50, unique: true })
  docNo: string;

  @Column({ name: 'doc_type', length: 20 })
  docType: string; // TAX_INVOICE, DEBIT_NOTE, CREDIT_NOTE

  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  @Column({ name: 'customer_id', nullable: true })
  customerId: number;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'customer_name', length: 255 })
  customerName: string;

  @Column({ name: 'customer_tax_id', length: 20 })
  customerTaxId: string;

  @Column({ name: 'customer_address', type: 'text', nullable: true })
  customerAddress: string;

  @Column({ name: 'reference_doc_no', length: 50, nullable: true })
  referenceDocNo: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'vat_rate', type: 'decimal', precision: 5, scale: 2, default: 7 })
  vatRate: number;

  @Column({ name: 'vat_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  vatAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ length: 20, default: 'DRAFT' })
  status: string; // DRAFT, ISSUED, CANCELLED

  @Column({ type: 'text', nullable: true })
  reason: string;

  @OneToMany(() => TaxInvoiceLine, (line) => line.taxInvoice, { cascade: true })
  lines: TaxInvoiceLine[];

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('tax_invoice_lines')
export class TaxInvoiceLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tax_invoice_id' })
  taxInvoiceId: number;

  @ManyToOne(() => TaxInvoice, (invoice) => invoice.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tax_invoice_id' })
  taxInvoice: TaxInvoice;

  @Column({ name: 'line_no' })
  lineNo: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 1 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;
}
