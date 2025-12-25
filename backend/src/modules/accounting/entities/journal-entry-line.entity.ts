import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JournalEntryEntity } from './journal-entry.entity';
import { ChartOfAccountEntity } from './chart-of-account.entity';

@Entity('journal_entry_lines')
export class JournalEntryLineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'journal_entry_id' })
  journalEntryId: number;

  @ManyToOne(() => JournalEntryEntity, je => je.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry: JournalEntryEntity;

  @Column({ name: 'line_no', type: 'int' })
  lineNo: number;

  @Column({ name: 'account_id' })
  accountId: number;

  @ManyToOne(() => ChartOfAccountEntity)
  @JoinColumn({ name: 'account_id' })
  account: ChartOfAccountEntity;

  @Column({ name: 'account_code', type: 'varchar', length: 20 })
  accountCode: string;

  @Column({ name: 'account_name', type: 'varchar', length: 200 })
  accountName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'debit_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  debitAmount: number;

  @Column({ name: 'credit_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  creditAmount: number;

  // Partner reference (Customer or Supplier)
  @Column({ name: 'partner_type', type: 'varchar', length: 20, nullable: true })
  partnerType: string; // CUSTOMER, SUPPLIER

  @Column({ name: 'partner_id', nullable: true })
  partnerId: number;

  @Column({ name: 'partner_name', type: 'varchar', length: 200, nullable: true })
  partnerName: string;

  // Cost center for departmental accounting (optional)
  @Column({ name: 'cost_center', type: 'varchar', length: 50, nullable: true })
  costCenter: string;

  // Product reference for inventory transactions
  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @Column({ name: 'product_code', type: 'varchar', length: 50, nullable: true })
  productCode: string;

  // Warehouse reference
  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: number;

  // Tax reference
  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 4, nullable: true })
  taxAmount: number;

  // Reference document line
  @Column({ name: 'reference_line_id', nullable: true })
  referenceLineId: number;
}
