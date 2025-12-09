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

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  qty: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4 })
  unitCost: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 })
  lineTotal: number;

  @ManyToOne(() => GoodsReceiptEntity, grn => grn.items)
  @JoinColumn({ name: 'goods_receipt_id' })
  goodsReceipt: GoodsReceiptEntity;
}
