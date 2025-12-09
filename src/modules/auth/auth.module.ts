import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserEntity } from '../user/entities/user.entity';
import { UserRoleEntity } from '../user/entities/user-role.entity';
import { RoleEntity } from '../user/entities/role.entity';
import { RolePermissionEntity } from '../user/entities/role-permission.entity';
import { PermissionEntity } from '../user/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity, RoleEntity, RolePermissionEntity, PermissionEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'svs-secret-key'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN', '1d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
