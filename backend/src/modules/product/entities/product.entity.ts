import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductCategoryEntity } from './product-category.entity';
import { UnitEntity } from './unit.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ name: 'unit_id', nullable: true })
  unitId: number;

  @Column({ length: 50, nullable: true })
  barcode: string;
 
 @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'min_stock', type: 'decimal', precision: 15, scale: 4, default: 0 })
  minStock: number;

  @Column({ name: 'max_stock', type: 'decimal', precision: 15, scale: 4, default: 0 })
  maxStock: number;

  @Column({ name: 'reorder_point', type: 'decimal', precision: 15, scale: 4, default: 0 })
  reorderPoint: number;

  @Column({ name: 'standard_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  standardCost: number;

  @Column({ name: 'selling_price', type: 'decimal', precision: 15, scale: 4, default: 0 })
  sellingPrice: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => ProductCategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategoryEntity;

  @ManyToOne(() => UnitEntity)
  @JoinColumn({ name: 'unit_id' })
  unit: UnitEntity;
}
