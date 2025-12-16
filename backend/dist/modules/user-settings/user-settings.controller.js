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
exports.UserSettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_settings_service_1 = require("./user-settings.service");
let UserSettingsController = class UserSettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getAll(req) {
        return this.settingsService.getAll(req.user.id);
    }
    async getSellerSettings(req) {
        return this.settingsService.getSellerSettings(req.user.id);
    }
    async updateSellerSettings(req, body) {
        await this.settingsService.set(req.user.id, 'seller', body);
        return { success: true, message: 'บันทึกข้อมูลผู้ขายสำเร็จ' };
    }
    async getQuotationDefaults(req) {
        return this.settingsService.getQuotationDefaults(req.user.id);
    }
    async updateQuotationDefaults(req, body) {
        await this.settingsService.set(req.user.id, 'quotationDefaults', body);
        return { success: true, message: 'บันทึกค่าเริ่มต้นสำเร็จ' };
    }
    async get(req, key) {
        return this.settingsService.get(req.user.id, key);
    }
    async set(req, key, body) {
        await this.settingsService.set(req.user.id, key, body.value);
        return { success: true };
    }
    async delete(req, key) {
        await this.settingsService.delete(req.user.id, key);
        return { success: true };
    }
};
exports.UserSettingsController = UserSettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all settings for current user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSettingsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('seller'),
    (0, swagger_1.ApiOperation)({ summary: 'Get seller settings' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSettingsController.prototype, "getSellerSettings", null);
__decorate([
    (0, common_1.Put)('seller'),
    (0, swagger_1.ApiOperation)({ summary: 'Update seller settings' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserSettingsController.prototype, "updateSellerSettings", null);
__decorate([
    (0, common_1.Get)('quotation-defaults'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quotation defaults' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSettingsController.prototype, "getQuotationDefaults", null);
__decorate([
    (0, common_1.Put)('quotation-defaults'),
    (0, swagger_1.ApiOperation)({ summary: 'Update quotation defaults' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserSettingsController.prototype, "updateQuotationDefaults", null);
__decorate([
    (0, common_1.Get)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific setting' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserSettingsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Update specific setting' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('key')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserSettingsController.prototype, "set", null);
__decorate([
    (0, common_1.Delete)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete specific setting' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserSettingsController.prototype, "delete", null);
exports.UserSettingsController = UserSettingsController = __decorate([
    (0, swagger_1.ApiTags)('User Settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('user-settings'),
    __metadata("design:paramtypes", [user_settings_service_1.UserSettingsService])
], UserSettingsController);
//# sourceMappingURL=user-settings.controller.js.map