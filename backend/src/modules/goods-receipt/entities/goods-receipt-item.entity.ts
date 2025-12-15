import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { GoodsReceiptEntity } from './goods-receipt.entity';

@Entity('goods_receipt_items')
export class GoodsReceiptItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'goods_receipt_id' })
  goodsReceiptId: number;

  @Column({ name: 'line_no' })
  lineNo: number;

  // Link to PO and QT Items
  @Column({ name: 'po_item_id', nullable: true })
  poItemId: number;

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

  // Cost
  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4 })
  unitCost: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 })
  lineTotal: number;

  // Expected vs Actual Cost (from PO)
  @Column({ name: 'expected_unit_cost', type: 'decimal', precision: 15, scale: 4, nullable: true })
  expectedUnitCost: number;

  @Column({ name: 'cost_variance', type: 'decimal', precision: 15, scale: 4, nullable: true })
  costVariance: number;

  @Column({ name: 'variance_percent', type: 'decimal', precision: 5, scale: 2, nullable: true })
  variancePercent: number;

  @Column({ name: 'has_variance_alert', type: 'boolean', default: false })
  hasVarianceAlert: boolean;

  // Lot/Batch Tracking
  @Column({ name: 'lot_no', type: 'varchar', length: 50, nullable: true })
  lotNo: string;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date;

  // Storage Location
  @Column({ name: 'location_code', type: 'varchar', length: 50, nullable: true })
  locationCode: string;

  // Notes
  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote: string;

  // Temp Product Activation
  @Column({ name: 'activated_product_id', nullable: true })
  activatedProductId: number;

  @ManyToOne(() => GoodsReceiptEntity, grn => grn.items)
  @JoinColumn({ name: 'goods_receipt_id' })
  goodsReceipt: GoodsReceiptEntity;
}
