import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findAll(): Promise<{
        id: number;
        username: string;
        fullName: string;
        email: string;
        isActive: boolean;
        roles: string[];
        createdAt: Date;
    }[]>;
    findAllRoles(): Promise<import("./entities").RoleEntity[]>;
    findOne(id: number): Promise<import("./entities").UserEntity>;
    create(dto: CreateUserDto): Promise<import("./entities").UserEntity>;
    update(id: number, dto: UpdateUserDto): Promise<import("./entities").UserEntity>;
    updateRoles(id: number, body: {
        roles: string[];
    }): Promise<{
        message: string;
    }>;
    resetPassword(id: number, body: {
        password: string;
    }): Promise<{
        message: string;
    }>;
    toggleActive(id: number): Promise<{
        message: string;
    }>;
    delete(id: number): Promise<import("./entities").UserEntity>;
}
