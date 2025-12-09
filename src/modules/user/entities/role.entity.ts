import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RolePermissionEntity } from './role-permission.entity';
import { UserRoleEntity } from './user-role.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => RolePermissionEntity, rp => rp.role)
  rolePermissions: RolePermissionEntity[];

  @OneToMany(() => UserRoleEntity, ur => ur.role)
  userRoles: UserRoleEntity[];
}
