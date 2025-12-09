export declare class CreateUserDto {
    username: string;
    password: string;
    fullName: string;
    email?: string;
    roleIds?: number[];
}
export declare class UpdateUserDto {
    fullName?: string;
    email?: string;
    password?: string;
    roleIds?: number[];
}
