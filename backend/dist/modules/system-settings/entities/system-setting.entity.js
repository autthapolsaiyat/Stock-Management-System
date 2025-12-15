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
exports.SystemSettingEntity = void 0;
const typeorm_1 = require("typeorm");
let SystemSettingEntity = class SystemSettingEntity {
};
exports.SystemSettingEntity = SystemSettingEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SystemSettingEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setting_key', type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], SystemSettingEntity.prototype, "settingKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setting_value', type: 'text' }),
    __metadata("design:type", String)
], SystemSettingEntity.prototype, "settingValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setting_type', type: 'varchar', length: 20, default: 'STRING' }),
    __metadata("design:type", String)
], SystemSettingEntity.prototype, "settingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SystemSettingEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], SystemSettingEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SystemSettingEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], SystemSettingEntity.prototype, "updatedBy", void 0);
exports.SystemSettingEntity = SystemSettingEntity = __decorate([
    (0, typeorm_1.Entity)('system_settings')
], SystemSettingEntity);
//# sourceMappingURL=system-setting.entity.js.map