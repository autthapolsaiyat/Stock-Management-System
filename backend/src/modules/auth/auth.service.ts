import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission'],
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
    };
    
    return {
      user: { 
        id: user.id, 
        username: user.username, 
        fullName: user.fullName, 
        email: user.email,
        quotationType: user.quotationType,
      },
      accessToken: this.jwtService.sign(payload),
      roles,
      permissions,
      quotationType: user.quotationType,
    };
  }

  async validateUser(payload: any): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    });
  }
}
