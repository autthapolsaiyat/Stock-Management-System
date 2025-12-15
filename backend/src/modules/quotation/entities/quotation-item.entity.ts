import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { QuotationEntity } from './quotation.entity';

@Entity('quotation_items')
export class QuotationItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quotation_id' })
  quotationId: number;

  @Column({ name: 'line_no' })
  lineNo: number;

  // สินค้า (เลือกอย่างใดอย่างหนึ่ง)
  @Column({ name: 'source_type', type: 'varchar', length: 10, default: 'MASTER' })
  sourceType: string; // MASTER, TEMP

  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @Column({ name: 'temp_product_id', nullable: true })
  tempProductId: number;

  // ข้อมูลสินค้า (Snapshot)
  @Column({ name: 'item_code', type: 'varchar', length: 50 })
  itemCode: string;

  @Column({ name: 'item_name', type: 'varchar', length: 255 })
  itemName: string;

  @Column({ name: 'item_description', type: 'text', nullable: true })
  itemDescription: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;

  // จำนวนและหน่วย
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  qty: number;

  @Column({ type: 'varchar', length: 20, default: 'ea' })
  unit: string;

  // ราคา (ต่อหน่วย)
  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 })
  unitPrice: number;

  @Column({ name: 'estimated_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  estimatedCost: number;

  // ส่วนลด
  @Column({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  // ยอดรวม
  @Column({ name: 'net_price', type: 'decimal', precision: 15, scale: 4, default: 0 })
  netPrice: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 })
  lineTotal: number;

  // Margin Calculation
  @Column({ name: 'margin_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  marginAmount: number;

  @Column({ name: 'margin_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  marginPercent: number;

  // Fulfillment Tracking
  @Column({ name: 'qty_quoted', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyQuoted: number;

  @Column({ name: 'qty_ordered', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyOrdered: number;

  @Column({ name: 'qty_received', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyReceived: number;

  @Column({ name: 'qty_sold', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtySold: number;

  @Column({ name: 'qty_cancelled', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyCancelled: number;

  @Column({ name: 'qty_remaining', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyRemaining: number;

  // Item Status
  @Column({ name: 'item_status', type: 'varchar', length: 20, default: 'PENDING' })
  itemStatus: string; // PENDING, ORDERED, RECEIVED, SOLD, PARTIAL, CANCELLED

  // Actual Cost (จาก GR)
  @Column({ name: 'actual_cost', type: 'decimal', precision: 15, scale: 4, nullable: true })
  actualCost: number;

  @Column({ name: 'actual_margin_amount', type: 'decimal', precision: 15, scale: 4, nullable: true })
  actualMarginAmount: number;

  @Column({ name: 'actual_margin_percent', type: 'decimal', precision: 5, scale: 2, nullable: true })
  actualMarginPercent: number;

  @Column({ name: 'cost_variance_amount', type: 'decimal', precision: 15, scale: 4, nullable: true })
  costVarianceAmount: number;

  @Column({ name: 'cost_variance_percent', type: 'decimal', precision: 5, scale: 2, nullable: true })
  costVariancePercent: number;

  // Invoice Price
  @Column({ name: 'invoice_price', type: 'decimal', precision: 15, scale: 4, nullable: true })
  invoicePrice: number;

  @Column({ name: 'price_adjustment_reason', type: 'text', nullable: true })
  priceAdjustmentReason: string;

  @Column({ name: 'price_adjustment_approved_by', nullable: true })
  priceAdjustmentApprovedBy: number;

  // Cancellation
  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: number;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  // Notes
  @Column({ name: 'public_note', type: 'text', nullable: true })
  publicNote: string;

  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote: string;

  // Link to related documents
  @Column({ name: 'po_item_id', nullable: true })
  poItemId: number;

  @Column({ name: 'gr_item_id', nullable: true })
  grItemId: number;

  @Column({ name: 'invoice_item_id', nullable: true })
  invoiceItemId: number;

  @ManyToOne(() => QuotationEntity, quotation => quotation.items)
  @JoinColumn({ name: 'quotation_id' })
  quotation: QuotationEntity;
}
