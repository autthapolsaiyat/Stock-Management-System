import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('doc_sequences')
@Unique(['docType', 'yearMonth'])
export class DocSequenceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'doc_type', type: 'varchar', length: 20 })
  docType: string;

  @Column({ name: 'year_month', type: 'varchar', length: 4 })
  yearMonth: string;

  @Column({ name: 'last_number', type: 'int', default: 0 })
  lastNumber: number;

  @Column({ name: 'prefix', type: 'varchar', length: 10, nullable: true })
  prefix: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
