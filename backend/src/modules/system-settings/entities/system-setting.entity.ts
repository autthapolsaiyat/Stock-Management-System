import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'setting_key', type: 'varchar', length: 100, unique: true })
  settingKey: string;

  @Column({ name: 'setting_value', type: 'text' })
  settingValue: string;

  @Column({ name: 'setting_type', type: 'varchar', length: 20, default: 'STRING' })
  settingType: string; // STRING, NUMBER, BOOLEAN, JSON

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;
}
