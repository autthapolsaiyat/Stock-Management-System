import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ChartOfAccountEntity } from './chart-of-account.entity';

export enum BankAccountType {
  SAVINGS = 'SAVINGS',       // ออมทรัพย์
  CURRENT = 'CURRENT',       // กระแสรายวัน
  FIXED = 'FIXED',           // ฝากประจำ
  CASH = 'CASH',             // เงินสดย่อย
}

@Entity('bank_accounts')
export class BankAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'bank_name', type: 'varchar', length: 100 })
  bankName: string;

  @Column({ name: 'bank_branch', type: 'varchar', length: 100, nullable: true })
  bankBranch: string;

  @Column({ name: 'account_number', type: 'varchar', length: 30 })
  accountNumber: string;

  @Column({ name: 'account_type', type: 'varchar', length: 20 })
  accountType: BankAccountType;

  // Link to Chart of Accounts
  @Column({ name: 'chart_of_account_id' })
  chartOfAccountId: number;

  @ManyToOne(() => ChartOfAccountEntity)
  @JoinColumn({ name: 'chart_of_account_id' })
  chartOfAccount: ChartOfAccountEntity;

  // Balance tracking
  @Column({ name: 'opening_balance', type: 'decimal', precision: 15, scale: 4, default: 0 })
  openingBalance: number;

  @Column({ name: 'opening_balance_date', type: 'date', nullable: true })
  openingBalanceDate: Date;

  @Column({ name: 'current_balance', type: 'decimal', precision: 15, scale: 4, default: 0 })
  currentBalance: number;

  // Settings
  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Audit
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;
}
