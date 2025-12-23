import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StockAdjustmentEntity } from './stock-adjustment.entity';

@Entity('stock_adjustment_items')
export class StockAdjustmentItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stock_adjustment_id' })
  stockAdjustmentId: number;

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

  // จำนวนในระบบก่อนปรับ
  @Column({ name: 'qty_system', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtySystem: number;

  // จำนวนที่นับได้จริง (สำหรับ ADJ_COUNT)
  @Column({ name: 'qty_counted', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyCounted: number;

  // จำนวนที่ปรับ (+เพิ่ม, -ลด)
  @Column({ name: 'qty_adjust', type: 'decimal', precision: 15, scale: 4, default: 0 })
  qtyAdjust: number;

  // ต้นทุนต่อหน่วย
  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  unitCost: number;

  // มูลค่าที่ปรับ
  @Column({ name: 'value_adjust', type: 'decimal', precision: 15, scale: 4, default: 0 })
  valueAdjust: number;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => StockAdjustmentEntity, adj => adj.items)
  @JoinColumn({ name: 'stock_adjustment_id' })
  stockAdjustment: StockAdjustmentEntity;
}
