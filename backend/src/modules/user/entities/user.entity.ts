import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserRoleEntity } from './user-role.entity';
import { CustomerGroupEntity } from '../../customer-group/entities/customer-group.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'quotation_type', nullable: true })
  quotationType: string;

  @Column({ name: 'customer_group_id', nullable: true })
  customerGroupId: number;

  @ManyToOne(() => CustomerGroupEntity)
  @JoinColumn({ name: 'customer_group_id' })
  customerGroup: CustomerGroupEntity;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  // Session Management Fields
  @Column({ name: 'session_token', nullable: true })
  sessionToken: string;

  @Column({ name: 'session_device_info', nullable: true })
  sessionDeviceInfo: string;

  @Column({ name: 'session_created_at', nullable: true })
  sessionCreatedAt: Date;

  @Column({ name: 'allow_multiple_sessions', default: false })
  allowMultipleSessions: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];
}
