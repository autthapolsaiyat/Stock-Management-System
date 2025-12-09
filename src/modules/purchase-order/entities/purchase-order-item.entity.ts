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

  @Column({ name: 'qty_received', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyReceived: number;

  @ManyToOne(() => PurchaseOrderEntity, po => po.items)
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrderEntity;
}
