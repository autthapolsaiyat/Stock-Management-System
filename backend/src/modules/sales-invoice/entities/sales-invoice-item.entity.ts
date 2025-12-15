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

  // Link to Quotation Item
  @Column({ name: 'quotation_item_id', nullable: true })
  quotationItemId: number;

  // Product Info
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'item_code', type: 'varchar', length: 50, nullable: true })
  itemCode: string;

  @Column({ name: 'item_name', type: 'varchar', length: 255, nullable: true })
  itemName: string;

  @Column({ name: 'item_description', type: 'text', nullable: true })
  itemDescription: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;

  // Quantity
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  qty: number;

  @Column({ type: 'varchar', length: 20, default: 'ea' })
  unit: string;

  // Pricing
  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 })
  unitPrice: number;

  @Column({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'net_price', type: 'decimal', precision: 15, scale: 4, default: 0 })
  netPrice: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 })
  lineTotal: number;

  // Cost (from FIFO)
  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  unitCost: number;

  @Column({ name: 'cost_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  costTotal: number;

  // Profit
  @Column({ name: 'profit_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  profitAmount: number;

  @Column({ name: 'profit_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  profitPercent: number;

  // Quotation Price Comparison
  @Column({ name: 'quoted_price', type: 'decimal', precision: 15, scale: 4, nullable: true })
  quotedPrice: number;

  @Column({ name: 'price_variance', type: 'decimal', precision: 15, scale: 4, nullable: true })
  priceVariance: number;

  @Column({ name: 'price_variance_percent', type: 'decimal', precision: 5, scale: 2, nullable: true })
  priceVariancePercent: number;

  @Column({ name: 'has_price_variance', type: 'boolean', default: false })
  hasPriceVariance: boolean;

  @Column({ name: 'price_adjustment_reason', type: 'text', nullable: true })
  priceAdjustmentReason: string;

  // Notes
  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote: string;

  @ManyToOne(() => SalesInvoiceEntity, invoice => invoice.items)
  @JoinColumn({ name: 'sales_invoice_id' })
  salesInvoice: SalesInvoiceEntity;
}
