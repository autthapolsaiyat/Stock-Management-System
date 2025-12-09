import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findAll(): Promise<import("./entities").UserEntity[]>;
    findAllRoles(): Promise<import("./entities").RoleEntity[]>;
    findOne(id: number): Promise<import("./entities").UserEntity>;
    create(dto: CreateUserDto): Promise<import("./entities").UserEntity>;
    update(id: number, dto: UpdateUserDto): Promise<import("./entities").UserEntity>;
    delete(id: number): Promise<import("./entities").UserEntity>;
}
