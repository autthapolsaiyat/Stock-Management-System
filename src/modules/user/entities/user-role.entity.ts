import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity('user_roles')
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, user => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, role => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
