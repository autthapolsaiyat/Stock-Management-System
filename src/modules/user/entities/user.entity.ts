import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRoleEntity } from './user-role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @OneToMany(() => UserRoleEntity, userRole => userRole.user)
  userRoles: UserRoleEntity[];
}
