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
exports.UserSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_setting_entity_1 = require("./entities/user-setting.entity");
let UserSettingsService = class UserSettingsService {
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }
    async getAll(userId) {
        const settings = await this.settingsRepository.find({ where: { userId } });
        const result = {};
        settings.forEach(s => {
            try {
                result[s.settingKey] = JSON.parse(s.settingValue);
            }
            catch {
                result[s.settingKey] = s.settingValue;
            }
        });
        return result;
    }
    async get(userId, key) {
        const setting = await this.settingsRepository.findOne({
            where: { userId, settingKey: key },
        });
        if (!setting)
            return null;
        try {
            return JSON.parse(setting.settingValue);
        }
        catch {
            return setting.settingValue;
        }
    }
    async set(userId, key, value) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        let setting = await this.settingsRepository.findOne({
            where: { userId, settingKey: key },
        });
        if (setting) {
            setting.settingValue = stringValue;
        }
        else {
            setting = this.settingsRepository.create({
                userId,
                settingKey: key,
                settingValue: stringValue,
            });
        }
        return this.settingsRepository.save(setting);
    }
    async setBulk(userId, settings) {
        for (const [key, value] of Object.entries(settings)) {
            await this.set(userId, key, value);
        }
    }
    async delete(userId, key) {
        await this.settingsRepository.delete({ userId, settingKey: key });
    }
    async getSellerSettings(userId) {
        const settings = await this.get(userId, 'seller');
        return settings || {
            name: '',
            surname: '',
            nickname: '',
            phone: '',
            email: '',
            signatureUrl: '',
            signaturePosition: 'ผู้เสนอราคา',
            displayOptions: {
                fullName: true,
                nickname: false,
                phone: true,
                email: true,
                signature: true,
            },
        };
    }
    async getQuotationDefaults(userId) {
        const settings = await this.get(userId, 'quotationDefaults');
        return settings || {
            validDays: 30,
            deliveryDays: 120,
            creditTermDays: 30,
            paymentTerms: 'ชำระเงินภายใน 30 วัน หลังจากวันที่ในใบแจ้งหนี้',
            deliveryTerms: 'จัดส่งภายใน 120 วัน หลังจากได้รับใบสั่งซื้อ',
            footerNote: '',
        };
    }
};
exports.UserSettingsService = UserSettingsService;
exports.UserSettingsService = UserSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_setting_entity_1.UserSettingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserSettingsService);
//# sourceMappingURL=user-settings.service.js.map