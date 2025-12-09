import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_categories')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => ProductCategoryEntity)
  @JoinColumn({ name: 'parent_id' })
  parent: ProductCategoryEntity;
}
