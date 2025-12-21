import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<UserEntity>, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            username: string;
            fullName: string;
            email: string;
            quotationType: string;
        };
        accessToken: string;
        roles: string[];
        permissions: string[];
        quotationType: string;
    }>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    validateUser(payload: any): Promise<UserEntity | null>;
}
