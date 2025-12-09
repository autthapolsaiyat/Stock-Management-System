import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('customer_contacts')
export class CustomerContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: number;

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

  @ManyToOne(() => CustomerEntity, customer => customer.contacts)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;
}
