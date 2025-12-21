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
exports.VCardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
let VCardController = class VCardController {
    constructor(userRepository, dataSource) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
    }
    async getVCard(username, res) {
        const user = await this.userRepository.findOne({
            where: { username, isActive: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const profileSettings = await this.dataSource.query(`SELECT setting_value FROM user_settings 
       WHERE user_id = $1 AND setting_key = 'profile'`, [user.id]);
        let profile = {};
        if (profileSettings && profileSettings.length > 0) {
            try {
                profile = JSON.parse(profileSettings[0].setting_value);
            }
            catch (e) {
                profile = {};
            }
        }
        const companySettings = await this.dataSource.query(`SELECT setting_key, setting_value FROM system_settings 
       WHERE setting_key IN ('companyName', 'companyWebsite', 'companyAddress', 'companyPhone')`);
        const company = {};
        companySettings.forEach((s) => {
            company[s.setting_key] = s.setting_value;
        });
        const fullName = user.fullName || username;
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const vcard = this.buildVCard({
            firstName,
            lastName,
            fullName,
            organization: company.companyName || 'บริษัท แสงวิทย์ไซเอนซ์ จำกัด',
            title: profile.position || '',
            phone: profile.phone || '',
            email: user.email || '',
            website: company.companyWebsite || 'https://www.saengvithscience.co.th',
            address: company.companyAddress || '',
            note: `SVS Business Suite - ${profile.department || ''}`.trim(),
        });
        const filename = `${username}.vcf`;
        res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(vcard);
    }
    buildVCard(data) {
        const lines = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${data.lastName};${data.firstName};;;`,
            `FN:${data.fullName}`,
        ];
        if (data.organization) {
            lines.push(`ORG:${data.organization}`);
        }
        if (data.title) {
            lines.push(`TITLE:${data.title}`);
        }
        if (data.phone) {
            const cleanPhone = data.phone.replace(/[^\d-]/g, '');
            lines.push(`TEL;TYPE=CELL:${cleanPhone}`);
        }
        if (data.email) {
            lines.push(`EMAIL:${data.email}`);
        }
        if (data.website) {
            lines.push(`URL:${data.website}`);
        }
        if (data.address) {
            lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`);
        }
        if (data.note && data.note.trim() !== 'SVS Business Suite -') {
            lines.push(`NOTE:${data.note}`);
        }
        lines.push('END:VCARD');
        return lines.join('\r\n');
    }
};
exports.VCardController = VCardController;
__decorate([
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VCardController.prototype, "getVCard", null);
exports.VCardController = VCardController = __decorate([
    (0, swagger_1.ApiTags)('VCard'),
    (0, common_1.Controller)('vcard'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], VCardController);
//# sourceMappingURL=vcard.controller.js.map