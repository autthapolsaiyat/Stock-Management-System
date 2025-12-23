import { UserRoleEntity } from './user-role.entity';
import { CustomerGroupEntity } from '../../customer-group/entities/customer-group.entity';
export declare class UserEntity {
    id: number;
    username: string;
    passwordHash: string;
    fullName: string;
    email: string;
    isActive: boolean;
    quotationType: string;
    customerGroupId: number;
    customerGroup: CustomerGroupEntity;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number;
    userRoles: UserRoleEntity[];
}
