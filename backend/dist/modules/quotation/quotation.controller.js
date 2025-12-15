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
exports.QuotationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const quotation_service_1 = require("./quotation.service");
let QuotationController = class QuotationController {
    constructor(quotationService) {
        this.quotationService = quotationService;
    }
    findAll(status, qtType) {
        return this.quotationService.findAll(status, qtType);
    }
    findOne(id) {
        return this.quotationService.findOne(id);
    }
    getItemsForPO(id) {
        return this.quotationService.getItemsForPO(id);
    }
    getItemsForInvoice(id) {
        return this.quotationService.getItemsForInvoice(id);
    }
    create(dto, req) {
        return this.quotationService.create(dto, req.user.sub);
    }
    update(id, dto, req) {
        return this.quotationService.update(id, dto, req.user.sub);
    }
    submitForApproval(id, req) {
        return this.quotationService.submitForApproval(id, req.user.sub);
    }
    approve(id, note, req) {
        return this.quotationService.approve(id, req.user.sub, note);
    }
    approveMargin(id, note, req) {
        return this.quotationService.approveMargin(id, req.user.sub, note);
    }
    send(id, req) {
        return this.quotationService.send(id, req.user.sub);
    }
    confirm(id, req) {
        return this.quotationService.confirm(id, req.user.sub);
    }
    cancel(id, reason, req) {
        return this.quotationService.cancel(id, req.user.sub, reason);
    }
    cancelItem(id, itemId, reason, req) {
        return this.quotationService.cancelItem(id, itemId, req.user.sub, reason);
    }
};
exports.QuotationController = QuotationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'qtType', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('qtType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/items-for-po'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "getItemsForPO", null);
__decorate([
    (0, common_1.Get)(':id/items-for-invoice'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "getItemsForInvoice", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "submitForApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('note')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/approve-margin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('note')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "approveMargin", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "send", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/items/:itemId/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('reason')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", void 0)
], QuotationController.prototype, "cancelItem", null);
exports.QuotationController = QuotationController = __decorate([
    (0, swagger_1.ApiTags)('Quotations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('quotations'),
    __metadata("design:paramtypes", [quotation_service_1.QuotationService])
], QuotationController);
//# sourceMappingURL=quotation.controller.js.map