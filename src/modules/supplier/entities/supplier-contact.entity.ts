import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { SupplierEntity } from './supplier.entity';

@Entity('supplier_contacts')
export class SupplierContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'supplier_id' })
  supplierId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true })
  position: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @ManyToOne(() => SupplierEntity, supplier => supplier.contacts)
  @JoinColumn({ name: 'supplier_id' })
  supplier: SupplierEntity;
}
