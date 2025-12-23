import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StockAdjustmentItemEntity } from './stock-adjustment-item.entity';

@Entity('stock_adjustments')
export class StockAdjustmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'doc_base_no', type: 'varchar', length: 20 })
  docBaseNo: string;

  @Column({ name: 'doc_revision', type: 'int', default: 1 })
  docRevision: number;

  @Column({ name: 'doc_full_no', type: 'varchar', length: 25, unique: true })
  docFullNo: string;

  @Column({ name: 'is_latest_revision', type: 'boolean', default: true })
  isLatestRevision: boolean;

  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ name: 'warehouse_name', type: 'varchar', length: 200, nullable: true })
  warehouseName: string;

  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  // ADJ_IN = เพิ่มสต็อก, ADJ_OUT = ลดสต็อก, ADJ_COUNT = ปรับตามการนับ
  @Column({ name: 'adjustment_type', type: 'varchar', length: 20, default: 'ADJ_COUNT' })
  adjustmentType: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  reason: string;

  // DRAFT, POSTED, CANCELLED
  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string;

  @Column({ name: 'total_qty_adjust', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalQtyAdjust: number;

  @Column({ name: 'total_value_adjust', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalValueAdjust: number;

  @Column({ type: 'text', nullable: true })
  remark: string;

  // Reference to Stock Count if any
  @Column({ name: 'stock_count_id', nullable: true })
  stockCountId: number;

  @Column({ name: 'posted_at', type: 'timestamptz', nullable: true })
  postedAt: Date;

  @Column({ name: 'posted_by', nullable: true })
  postedBy: number;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @OneToMany(() => StockAdjustmentItemEntity, item => item.stockAdjustment)
  items: StockAdjustmentItemEntity[];
}
