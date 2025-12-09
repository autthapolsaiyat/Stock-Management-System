import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UserService {
    private userRepository;
    private roleRepository;
    private userRoleRepository;
    constructor(userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>, userRoleRepository: Repository<UserRoleEntity>);
    findAll(): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity>;
    create(dto: CreateUserDto): Promise<UserEntity>;
    update(id: number, dto: UpdateUserDto): Promise<UserEntity>;
    delete(id: number): Promise<UserEntity>;
    private assignRoles;
    findAllRoles(): Promise<RoleEntity[]>;
}
