import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('fifo_transactions')
export class FifoTransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fifo_layer_id' })
  fifoLayerId: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  qty: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4 })
  unitCost: number;

  @Column({ name: 'total_cost', type: 'decimal', precision: 15, scale: 4 })
  totalCost: number;

  @Column({ name: 'transaction_type', length: 10 })
  transactionType: string;

  @Column({ name: 'reference_type', length: 20 })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: number;

  @Column({ name: 'reference_item_id', nullable: true })
  referenceItemId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
