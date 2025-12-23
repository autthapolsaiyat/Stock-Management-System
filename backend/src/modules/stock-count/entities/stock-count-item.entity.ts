import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StockCountEntity } from './stock-count.entity';

@Entity('stock_count_items')
export class StockCountItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stock_count_id' })
  stockCountId: number;

  @Column({ name: 'line_no', type: 'int' })
  lineNo: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'item_code', type: 'varchar', length: 50, nullable: true })
  itemCode: string;

  @Column({ name: 'item_name', type: 'varchar', length: 200 })
  itemName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unit: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  // จำนวนในระบบ ณ เวลาที่เริ่มนับ
  @Column({ name: 'qty_system', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtySystem: number;

  // จำนวนที่นับได้ครั้งที่ 1
  @Column({ name: 'qty_count1', type: 'decimal', precision: 15, scale: 4, nullable: true })
  qtyCount1: number;

  // จำนวนที่นับได้ครั้งที่ 2 (recount)
  @Column({ name: 'qty_count2', type: 'decimal', precision: 15, scale: 4, nullable: true })
  qtyCount2: number;

  // จำนวนที่ยืนยัน (final)
  @Column({ name: 'qty_final', type: 'decimal', precision: 15, scale: 4, nullable: true })
  qtyFinal: number;

  // ส่วนต่าง
  @Column({ name: 'qty_variance', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyVariance: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  unitCost: number;

  @Column({ name: 'value_variance', type: 'decimal', precision: 15, scale: 4, default: 0 })
  valueVariance: number;

  // NOT_COUNTED, COUNTED, RECOUNTED, VERIFIED
  @Column({ name: 'count_status', type: 'varchar', length: 20, default: 'NOT_COUNTED' })
  countStatus: string;

  @Column({ name: 'counted_at', type: 'timestamptz', nullable: true })
  countedAt: Date;

  @Column({ name: 'counted_by', nullable: true })
  countedBy: number;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StockCountEntity, count => count.items)
  @JoinColumn({ name: 'stock_count_id' })
  stockCount: StockCountEntity;
}
