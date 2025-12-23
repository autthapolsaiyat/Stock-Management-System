import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            username: string;
            fullName: string;
            email: string;
            quotationType: string;
            customerGroupId: number;
            customerGroup: import("../customer-group/entities/customer-group.entity").CustomerGroupEntity;
        };
        accessToken: string;
        roles: string[];
        permissions: string[];
        quotationType: string;
        customerGroupId: number;
    }>;
    changePassword(req: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
