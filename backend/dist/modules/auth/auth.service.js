"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../user/entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const user = await this.userRepository.findOne({
            where: { username: dto.username, isActive: true },
            relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission'],
        });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.userRepository.update(user.id, { lastLoginAt: new Date() });
        const roles = user.userRoles.map(ur => ur.role.code);
        const permissions = [...new Set(user.userRoles.flatMap(ur => ur.role.rolePermissions.map(rp => rp.permission.code)))];
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
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.BadRequestException('ไม่พบผู้ใช้');
        }
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            throw new common_1.BadRequestException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
        }
        if (newPassword.length < 6) {
            throw new common_1.BadRequestException('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
        }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await this.userRepository.save(user);
        return { message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
    }
    async validateUser(payload) {
        return this.userRepository.findOne({
            where: { id: payload.sub, isActive: true },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map