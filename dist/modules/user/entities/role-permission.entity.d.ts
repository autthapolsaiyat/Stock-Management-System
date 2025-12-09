import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';
export declare class RolePermissionEntity {
    id: number;
    roleId: number;
    permissionId: number;
    createdAt: Date;
    role: RoleEntity;
    permission: PermissionEntity;
}
