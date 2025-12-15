import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrderEntity } from './purchase-order.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'purchase_order_id' })
  purchaseOrderId: number;

  @Column({ name: 'line_no' })
  lineNo: number;

  // Link to Quotation Item
  @Column({ name: 'quotation_id', nullable: true })
  quotationId: number;

  @Column({ name: 'quotation_item_id', nullable: true })
  quotationItemId: number;

  // Product (Master or Temp)
  @Column({ name: 'source_type', type: 'varchar', length: 10, default: 'MASTER' })
  sourceType: string; // MASTER, TEMP

  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @Column({ name: 'temp_product_id', nullable: true })
  tempProductId: number;

  // Item Info (Snapshot)
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

  // Receiving
  @Column({ name: 'qty_ordered', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyOrdered: number;

  @Column({ name: 'qty_received', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyReceived: number;

  @Column({ name: 'qty_remaining', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyRemaining: number;

  @Column({ name: 'item_status', type: 'varchar', length: 20, default: 'PENDING' })
  itemStatus: string; // PENDING, PARTIAL, RECEIVED, CANCELLED

  // Actual Cost (after receiving)
  @Column({ name: 'actual_unit_cost', type: 'decimal', precision: 15, scale: 4, nullable: true })
  actualUnitCost: number;

  // Notes
  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote: string;

  @Column({ name: 'supplier_note', type: 'text', nullable: true })
  supplierNote: string;

  @ManyToOne(() => PurchaseOrderEntity, po => po.items)
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrderEntity;
}
