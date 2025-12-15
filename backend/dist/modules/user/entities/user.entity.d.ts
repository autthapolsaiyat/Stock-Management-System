import { UserRoleEntity } from './user-role.entity';
export declare class UserEntity {
    id: number;
    username: string;
    passwordHash: string;
    fullName: string;
    email: string;
    isActive: boolean;
    quotationType: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number;
    userRoles: UserRoleEntity[];
}
