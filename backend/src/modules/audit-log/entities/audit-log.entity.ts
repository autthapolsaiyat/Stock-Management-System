import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
@Index(['module', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['createdAt'])
export class AuditLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'varchar', length: 20 })
  action: string;

  @Column({ name: 'document_id', type: 'int', nullable: true })
  documentId: number;

  @Column({ name: 'document_no', type: 'varchar', length: 50, nullable: true })
  documentNo: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'user_name', type: 'varchar', length: 100, nullable: true })
  userName: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
