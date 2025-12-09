import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('fifo_layers')
export class FifoLayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ name: 'qty_original', type: 'decimal', precision: 15, scale: 4 })
  qtyOriginal: number;

  @Column({ name: 'qty_remaining', type: 'decimal', precision: 15, scale: 4 })
  qtyRemaining: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4 })
  unitCost: number;

  @Column({ name: 'reference_type', type: 'varchar', length: 50, nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: number;

  @Column({ name: 'reference_item_id', nullable: true })
  referenceItemId: number;

  @Column({ name: 'received_at', type: 'timestamptz', nullable: true })
  receivedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
