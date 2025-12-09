import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { StockTransferEntity } from './stock-transfer.entity';

@Entity('stock_transfer_items')
export class StockTransferItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stock_transfer_id' })
  stockTransferId: number;

  @Column({ name: 'line_no' })
  lineNo: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  qty: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  unitCost: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  lineTotal: number;

  @ManyToOne(() => StockTransferEntity, transfer => transfer.items)
  @JoinColumn({ name: 'stock_transfer_id' })
  stockTransfer: StockTransferEntity;
}
