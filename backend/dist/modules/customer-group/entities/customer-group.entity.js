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
exports.CustomerGroupEntity = void 0;
const typeorm_1 = require("typeorm");
let CustomerGroupEntity = class CustomerGroupEntity {
};
exports.CustomerGroupEntity = CustomerGroupEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CustomerGroupEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, unique: true }),
    __metadata("design:type", String)
], CustomerGroupEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], CustomerGroupEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomerGroupEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], CustomerGroupEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CustomerGroupEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CustomerGroupEntity.prototype, "updatedAt", void 0);
exports.CustomerGroupEntity = CustomerGroupEntity = __decorate([
    (0, typeorm_1.Entity)('customer_groups')
], CustomerGroupEntity);
//# sourceMappingURL=customer-group.entity.js.map