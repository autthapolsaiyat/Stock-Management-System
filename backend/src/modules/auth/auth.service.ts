import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto, deviceInfo?: { browser?: string; os?: string; ip?: string; userAgent?: string }) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username, isActive: true },
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission', 'customerGroup'],
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate new session token
    const sessionToken = uuidv4();

    // Update session info
    await this.userRepository.update(user.id, { 
      lastLoginAt: new Date(),
      sessionToken: sessionToken,
      sessionDeviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : null,
      sessionCreatedAt: new Date(),
    });

    const roles = user.userRoles.map(ur => ur.role.code);
    const permissions = [...new Set(
      user.userRoles.flatMap(ur => ur.role.rolePermissions.map(rp => rp.permission.code))
    )];

    const payload = { 
      sub: user.id, 
      username: user.username, 
      roles, 
      permissions,
      quotationType: user.quotationType,
      customerGroupId: user.customerGroupId,
      sessionToken: sessionToken,
    };
    
    return {
      user: { 
        id: user.id, 
        username: user.username, 
        fullName: user.fullName, 
        email: user.email,
        quotationType: user.quotationType,
        customerGroupId: user.customerGroupId,
        customerGroup: user.customerGroup,
      },
      accessToken: this.jwtService.sign(payload),
      roles,
      permissions,
      quotationType: user.quotationType,
      customerGroupId: user.customerGroupId,
    };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('ไม่พบผู้ใช้');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
  }

  async validateUser(payload: any): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    });
  }

  async validateSession(payload: any): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // If user allows multiple sessions, always valid
    if (user.allowMultipleSessions) {
      return true;
    }

    // Check if session token matches
    if (user.sessionToken && payload.sessionToken !== user.sessionToken) {
      let deviceInfo = null;
      if (user.sessionDeviceInfo) {
        try {
          deviceInfo = JSON.parse(user.sessionDeviceInfo);
        } catch (e) {
          deviceInfo = null;
        }
      }

      throw new ForbiddenException({
        statusCode: 403,
        error: 'SESSION_EXPIRED',
        message: 'บัญชีของคุณถูกเข้าสู่ระบบจากอุปกรณ์อื่น',
        details: {
          loginTime: user.sessionCreatedAt,
          deviceInfo: deviceInfo,
        },
      });
    }

    return true;
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      sessionToken: null,
      sessionDeviceInfo: null,
      sessionCreatedAt: null,
    });
  }
}
