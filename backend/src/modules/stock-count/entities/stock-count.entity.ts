import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StockCountItemEntity } from './stock-count-item.entity';

@Entity('stock_counts')
export class StockCountEntity {
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

  @Column({ name: 'count_date', type: 'date' })
  countDate: Date;

  // FULL = นับทั้งคลัง, PARTIAL = นับบางส่วน, CYCLE = นับวนรอบ
  @Column({ name: 'count_type', type: 'varchar', length: 20, default: 'FULL' })
  countType: string;

  // สำหรับ PARTIAL/CYCLE - หมวดหมู่ที่เลือกนับ
  @Column({ name: 'category_ids', type: 'jsonb', nullable: true })
  categoryIds: number[];

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  // DRAFT, IN_PROGRESS, COMPLETED, APPROVED, ADJUSTED
  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string;

  @Column({ name: 'total_items', type: 'int', default: 0 })
  totalItems: number;

  @Column({ name: 'counted_items', type: 'int', default: 0 })
  countedItems: number;

  @Column({ name: 'variance_items', type: 'int', default: 0 })
  varianceItems: number;

  @Column({ name: 'total_variance_value', type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalVarianceValue: number;

  @Column({ type: 'text', nullable: true })
  remark: string;

  // Reference to created adjustment
  @Column({ name: 'adjustment_id', nullable: true })
  adjustmentId: number;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @OneToMany(() => StockCountItemEntity, item => item.stockCount)
  items: StockCountItemEntity[];
}
