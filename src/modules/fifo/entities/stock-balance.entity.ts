import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('stock_balances')
@Unique(['productId', 'warehouseId'])
export class StockBalanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ name: 'qty_on_hand', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyOnHand: number;

  @Column({ name: 'qty_reserved', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyReserved: number;

  @Column({ name: 'avg_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  avgCost: number;

  @Column({ name: 'last_received_at', type: 'timestamptz', nullable: true })
  lastReceivedAt: Date;

  @Column({ name: 'last_issued_at', type: 'timestamptz', nullable: true })
  lastIssuedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed property
  get qtyAvailable(): number {
    return Number(this.qtyOnHand) - Number(this.qtyReserved);
  }
}
