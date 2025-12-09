import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CustomerContactEntity } from './customer-contact.entity';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'tax_id', length: 20, nullable: true })
  taxId: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'credit_limit', type: 'decimal', precision: 15, scale: 4, default: 0 })
  creditLimit: number;

  @Column({ name: 'credit_term_days', default: 30 })
  creditTermDays: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => CustomerContactEntity, contact => contact.customer)
  contacts: CustomerContactEntity[];
}
