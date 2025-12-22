import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username, isActive: true },
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission', 'customerGroup'],
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

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
}
