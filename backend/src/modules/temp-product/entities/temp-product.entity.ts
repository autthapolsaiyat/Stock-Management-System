import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('temp_products')
export class TempProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'temp_code', type: 'varchar', length: 50, unique: true })
  tempCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 20, default: 'ea' })
  unit: string;

  @Column({ name: 'estimated_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  estimatedCost: number;

  @Column({ name: 'quoted_price', type: 'decimal', precision: 15, scale: 4, default: 0 })
  quotedPrice: number;

  @Column({ name: 'source_quotation_id', nullable: true })
  sourceQuotationId: number;

  @Column({ name: 'source_qt_item_id', nullable: true })
  sourceQtItemId: number;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: string; // PENDING, ACTIVATED, CANCELLED

  @Column({ name: 'activated_to_product_id', nullable: true })
  activatedToProductId: number;

  @Column({ name: 'activated_at', type: 'timestamptz', nullable: true })
  activatedAt: Date;

  @Column({ name: 'activated_by', nullable: true })
  activatedBy: number;

  @Column({ name: 'activated_from_gr_id', nullable: true })
  activatedFromGrId: number;

  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote: string;

  @Column({ name: 'supplier_note', type: 'text', nullable: true })
  supplierNote: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;
}
