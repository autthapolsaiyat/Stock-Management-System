import { RolePermissionEntity } from './role-permission.entity';
import { UserRoleEntity } from './user-role.entity';
export declare class RoleEntity {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    rolePermissions: RolePermissionEntity[];
    userRoles: UserRoleEntity[];
}
