import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';
export declare class UserRoleEntity {
    id: number;
    userId: number;
    roleId: number;
    createdAt: Date;
    user: UserEntity;
    role: RoleEntity;
}
