import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum AccountType {
  ASSET = 'ASSET',           // สินทรัพย์
  LIABILITY = 'LIABILITY',   // หนี้สิน
  EQUITY = 'EQUITY',         // ส่วนของผู้ถือหุ้น
  REVENUE = 'REVENUE',       // รายได้
  EXPENSE = 'EXPENSE',       // ค่าใช้จ่าย
}

export enum AccountGroup {
  // Assets
  CURRENT_ASSET = 'CURRENT_ASSET',           // สินทรัพย์หมุนเวียน
  FIXED_ASSET = 'FIXED_ASSET',               // สินทรัพย์ถาวร
  OTHER_ASSET = 'OTHER_ASSET',               // สินทรัพย์อื่น
  // Liabilities
  CURRENT_LIABILITY = 'CURRENT_LIABILITY',   // หนี้สินหมุนเวียน
  LONG_TERM_LIABILITY = 'LONG_TERM_LIABILITY', // หนี้สินระยะยาว
  // Equity
  SHARE_CAPITAL = 'SHARE_CAPITAL',           // ทุนเรือนหุ้น
  RETAINED_EARNINGS = 'RETAINED_EARNINGS',   // กำไรสะสม
  // Revenue
  SALES_REVENUE = 'SALES_REVENUE',           // รายได้จากการขาย
  OTHER_REVENUE = 'OTHER_REVENUE',           // รายได้อื่น
  // Expense
  COST_OF_GOODS = 'COST_OF_GOODS',           // ต้นทุนขาย
  OPERATING_EXPENSE = 'OPERATING_EXPENSE',   // ค่าใช้จ่ายในการดำเนินงาน
  OTHER_EXPENSE = 'OTHER_EXPENSE',           // ค่าใช้จ่ายอื่น
}

export enum BalanceType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

@Entity('chart_of_accounts')
export class ChartOfAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string; // เช่น 1100, 1110, 2100

  @Column({ type: 'varchar', length: 200 })
  name: string; // ชื่อภาษาไทย

  @Column({ name: 'name_en', type: 'varchar', length: 200, nullable: true })
  nameEn: string; // ชื่อภาษาอังกฤษ

  @Column({ name: 'account_type', type: 'varchar', length: 20 })
  accountType: AccountType;

  @Column({ name: 'account_group', type: 'varchar', length: 30 })
  accountGroup: AccountGroup;

  @Column({ name: 'balance_type', type: 'varchar', length: 10 })
  balanceType: BalanceType; // DEBIT or CREDIT

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne(() => ChartOfAccountEntity, account => account.children)
  @JoinColumn({ name: 'parent_id' })
  parent: ChartOfAccountEntity;

  @OneToMany(() => ChartOfAccountEntity, account => account.parent)
  children: ChartOfAccountEntity[];

  @Column({ type: 'int', default: 1 })
  level: number; // ระดับของบัญชี (1, 2, 3, ...)

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_system', type: 'boolean', default: false })
  isSystem: boolean; // บัญชีระบบ ห้ามลบ

  @Column({ name: 'is_control', type: 'boolean', default: false })
  isControl: boolean; // บัญชีคุม (AR, AP, Inventory)

  @Column({ name: 'control_type', type: 'varchar', length: 20, nullable: true })
  controlType: string; // AR, AP, INVENTORY, BANK, CASH

  // สำหรับ Default accounts
  @Column({ name: 'is_default_ar', type: 'boolean', default: false })
  isDefaultAR: boolean;

  @Column({ name: 'is_default_ap', type: 'boolean', default: false })
  isDefaultAP: boolean;

  @Column({ name: 'is_default_inventory', type: 'boolean', default: false })
  isDefaultInventory: boolean;

  @Column({ name: 'is_default_sales', type: 'boolean', default: false })
  isDefaultSales: boolean;

  @Column({ name: 'is_default_cogs', type: 'boolean', default: false })
  isDefaultCOGS: boolean;

  @Column({ name: 'is_default_vat_output', type: 'boolean', default: false })
  isDefaultVatOutput: boolean;

  @Column({ name: 'is_default_vat_input', type: 'boolean', default: false })
  isDefaultVatInput: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;
}
