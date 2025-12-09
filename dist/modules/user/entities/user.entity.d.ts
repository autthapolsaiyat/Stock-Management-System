import { UserRoleEntity } from './user-role.entity';
export declare class UserEntity {
    id: number;
    username: string;
    passwordHash: string;
    fullName: string;
    email: string;
    isActive: boolean;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number;
    userRoles: UserRoleEntity[];
}
