import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuotationEntity } from './quotation.entity';

@Entity('quotation_calculators')
export class QuotationCalculatorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quotation_id' })
  quotationId: number;

  @ManyToOne(() => QuotationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quotation_id' })
  quotation: QuotationEntity;

  @Column({ type: 'varchar', length: 100, default: 'Default' })
  name: string;

  @Column({ type: 'jsonb', default: {} })
  data: {
    settings: {
      exchangeRate: number;
      clearanceFee: number;
    };
    cells: Array<Array<{
      value: string | number | null;
      formula?: string;
    }>>;
    columnHeaders?: string[];
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
