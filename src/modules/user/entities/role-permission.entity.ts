import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Entity('role_permissions')
export class RolePermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'permission_id' })
  permissionId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => RoleEntity, role => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
