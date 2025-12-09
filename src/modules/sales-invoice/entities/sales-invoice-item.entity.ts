import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { SalesInvoiceEntity } from './sales-invoice.entity';

@Entity('sales_invoice_items')
export class SalesInvoiceItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sales_invoice_id' })
  salesInvoiceId: number;

  @Column({ name: 'line_no' })
  lineNo: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  qty: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 })
  unitPrice: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 })
  lineTotal: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  unitCost: number;

  @Column({ name: 'cost_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  costTotal: number;

  @ManyToOne(() => SalesInvoiceEntity, invoice => invoice.items)
  @JoinColumn({ name: 'sales_invoice_id' })
  salesInvoice: SalesInvoiceEntity;
}
