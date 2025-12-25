import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PeriodStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LOCKED = 'LOCKED',
}

@Entity('fiscal_periods')
export class FiscalPeriodEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fiscal_year', type: 'int' })
  fiscalYear: number; // ปีบัญชี

  @Column({ name: 'period_no', type: 'int' })
  periodNo: number; // 1-12 (หรือ 13 สำหรับปรับปรุง)

  @Column({ name: 'period_name', type: 'varchar', length: 50 })
  periodName: string; // เช่น "มกราคม 2568"

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'varchar', length: 20, default: PeriodStatus.OPEN })
  status: PeriodStatus;

  // Closing info
  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt: Date;

  @Column({ name: 'closed_by', nullable: true })
  closedBy: number;

  // Balance carried forward
  @Column({ name: 'is_year_end', type: 'boolean', default: false })
  isYearEnd: boolean;

  @Column({ name: 'year_end_processed', type: 'boolean', default: false })
  yearEndProcessed: boolean;

  // Audit
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
