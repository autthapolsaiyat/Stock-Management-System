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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const user_role_entity_1 = require("./user-role.entity");
const customer_group_entity_1 = require("../../customer-group/entities/customer-group.entity");
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash' }),
    __metadata("design:type", String)
], UserEntity.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_type', nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "quotationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_group_id', nullable: true }),
    __metadata("design:type", Number)
], UserEntity.prototype, "customerGroupId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_group_entity_1.CustomerGroupEntity),
    (0, typeorm_1.JoinColumn)({ name: 'customer_group_id' }),
    __metadata("design:type", customer_group_entity_1.CustomerGroupEntity)
], UserEntity.prototype, "customerGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', nullable: true }),
    __metadata("design:type", Date)
], UserEntity.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], UserEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], UserEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_role_entity_1.UserRoleEntity, (userRole) => userRole.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "userRoles", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
//# sourceMappingURL=user.entity.js.map