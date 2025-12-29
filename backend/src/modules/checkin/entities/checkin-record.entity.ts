import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export enum CheckinStatus {
  NORMAL = 'NORMAL',
  LATE = 'LATE',
  EARLY = 'EARLY',
}

@Entity('checkin_records')
@Unique(['userId', 'checkinDate'])
export class CheckinRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'checkin_date', type: 'date' })
  checkinDate: Date;

  // Clock In
  @Column({ name: 'clock_in_time', type: 'timestamp', nullable: true })
  clockInTime: Date;

  @Column({ name: 'clock_in_status', type: 'varchar', length: 20, nullable: true })
  clockInStatus: CheckinStatus;

  @Column({ name: 'clock_in_late_minutes', type: 'int', default: 0 })
  clockInLateMinutes: number;

  @Column({ name: 'clock_in_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  clockInLatitude: number;

  @Column({ name: 'clock_in_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  clockInLongitude: number;

  @Column({ name: 'clock_in_note', type: 'text', nullable: true })
  clockInNote: string;

  // Clock Out
  @Column({ name: 'clock_out_time', type: 'timestamp', nullable: true })
  clockOutTime: Date;

  @Column({ name: 'clock_out_status', type: 'varchar', length: 20, nullable: true })
  clockOutStatus: CheckinStatus;

  @Column({ name: 'clock_out_early_minutes', type: 'int', default: 0 })
  clockOutEarlyMinutes: number;

  @Column({ name: 'clock_out_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  clockOutLatitude: number;

  @Column({ name: 'clock_out_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  clockOutLongitude: number;

  @Column({ name: 'clock_out_note', type: 'text', nullable: true })
  clockOutNote: string;

  // OT
  @Column({ name: 'ot_hours', type: 'decimal', precision: 4, scale: 2, default: 0 })
  otHours: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
