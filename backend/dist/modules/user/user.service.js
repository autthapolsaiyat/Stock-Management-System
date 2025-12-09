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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./entities/user.entity");
const role_entity_1 = require("./entities/role.entity");
const user_role_entity_1 = require("./entities/user-role.entity");
let UserService = class UserService {
    constructor(userRepository, roleRepository, userRoleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
    }
    async findAll() {
        return this.userRepository.find({
            where: { isActive: true },
            relations: ['userRoles', 'userRoles.role'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async create(dto) {
        const existing = await this.userRepository.findOne({ where: { username: dto.username } });
        if (existing)
            throw new common_1.ConflictException('Username already exists');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            username: dto.username,
            passwordHash,
            fullName: dto.fullName,
            email: dto.email,
            isActive: true,
        });
        const savedUser = await this.userRepository.save(user);
        if (dto.roleIds?.length) {
            await this.assignRoles(savedUser.id, dto.roleIds);
        }
        return this.findOne(savedUser.id);
    }
    async update(id, dto) {
        const user = await this.findOne(id);
        if (dto.fullName)
            user.fullName = dto.fullName;
        if (dto.email !== undefined)
            user.email = dto.email;
        if (dto.password)
            user.passwordHash = await bcrypt.hash(dto.password, 10);
        await this.userRepository.save(user);
        if (dto.roleIds) {
            await this.assignRoles(id, dto.roleIds);
        }
        return this.findOne(id);
    }
    async delete(id) {
        const user = await this.findOne(id);
        user.isActive = false;
        return this.userRepository.save(user);
    }
    async assignRoles(userId, roleIds) {
        await this.userRoleRepository.delete({ userId });
        const userRoles = roleIds.map(roleId => this.userRoleRepository.create({ userId, roleId }));
        await this.userRoleRepository.save(userRoles);
    }
    async findAllRoles() {
        return this.roleRepository.find({ where: { isActive: true } });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRoleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map