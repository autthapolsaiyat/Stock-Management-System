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
        };
        accessToken: string;
        roles: string[];
        permissions: string[];
    }>;
}
