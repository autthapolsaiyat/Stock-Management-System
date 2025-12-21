import { UserService } from './user.service';
export declare class RoleController {
    private userService;
    constructor(userService: UserService);
    findAll(): Promise<import("./entities").RoleEntity[]>;
}
