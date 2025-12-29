import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export enum LeaveType {
  VACATION = 'VACATION',       // พักร้อน
  PERSONAL = 'PERSONAL',       // กิจส่วนตัว
  SICK = 'SICK',               // ป่วย
  MATERNITY = 'MATERNITY',     // คลอด
  ORDINATION = 'ORDINATION',   // อุปสมบท
}

export enum LeaveDuration {
  FULL = 'FULL',           // เต็มวัน
  HALF_AM = 'HALF_AM',     // ครึ่งวันเช้า
  HALF_PM = 'HALF_PM',     // ครึ่งวันบ่าย
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('leave_records')
@Unique(['userId', 'leaveDate', 'leaveType'])
export class LeaveRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'leave_date', type: 'date' })
  leaveDate: Date;

  @Column({ name: 'leave_type', type: 'varchar', length: 30 })
  leaveType: LeaveType;

  @Column({ name: 'leave_duration', type: 'varchar', length: 10, default: LeaveDuration.FULL })
  leaveDuration: LeaveDuration;

  @Column({ name: 'leave_days', type: 'decimal', precision: 3, scale: 1, default: 1 })
  leaveDays: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'varchar', length: 20, default: LeaveStatus.APPROVED })
  status: LeaveStatus;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
