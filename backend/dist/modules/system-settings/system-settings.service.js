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
exports.SystemSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
let SystemSettingsService = class SystemSettingsService {
    constructor(settingRepository) {
        this.settingRepository = settingRepository;
    }
    async findAll() {
        return this.settingRepository.find({ order: { category: 'ASC', settingKey: 'ASC' } });
    }
    async findByCategory(category) {
        return this.settingRepository.find({ where: { category }, order: { settingKey: 'ASC' } });
    }
    async findByKey(key) {
        const setting = await this.settingRepository.findOne({ where: { settingKey: key } });
        if (!setting)
            throw new common_1.NotFoundException(`Setting ${key} not found`);
        return setting;
    }
    async getValue(key, defaultValue) {
        try {
            const setting = await this.findByKey(key);
            return this.parseValue(setting.settingValue, setting.settingType);
        }
        catch {
            return defaultValue;
        }
    }
    async update(key, value, userId) {
        const setting = await this.findByKey(key);
        setting.settingValue = value;
        setting.updatedBy = userId;
        return this.settingRepository.save(setting);
    }
    async createOrUpdate(key, value, type, category, description, userId) {
        let setting = await this.settingRepository.findOne({ where: { settingKey: key } });
        if (setting) {
            setting.settingValue = value;
            setting.updatedBy = userId;
        }
        else {
            setting = this.settingRepository.create({
                settingKey: key,
                settingValue: value,
                settingType: type,
                category,
                description,
                updatedBy: userId,
            });
        }
        return this.settingRepository.save(setting);
    }
    parseValue(value, type) {
        switch (type) {
            case 'NUMBER':
                return parseFloat(value);
            case 'BOOLEAN':
                return value === 'true';
            case 'JSON':
                return JSON.parse(value);
            default:
                return value;
        }
    }
    async getMinMarginPercent() {
        return this.getValue('QT_MIN_MARGIN_PERCENT', 10);
    }
    async getLowMarginApproverRole() {
        return this.getValue('QT_LOW_MARGIN_APPROVER_ROLE', 'MANAGER');
    }
    async getVarianceAlertPercent() {
        return this.getValue('QT_VARIANCE_ALERT_PERCENT', 5);
    }
    async getQuotationTypes() {
        return this.getValue('QT_TYPES', ['STANDARD', 'FORENSIC', 'MAINTENANCE']);
    }
};
exports.SystemSettingsService = SystemSettingsService;
exports.SystemSettingsService = SystemSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.SystemSettingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SystemSettingsService);
//# sourceMappingURL=system-settings.service.js.map