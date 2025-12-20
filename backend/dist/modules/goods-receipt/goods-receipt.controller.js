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
exports.GoodsReceiptController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const goods_receipt_service_1 = require("./goods-receipt.service");
let GoodsReceiptController = class GoodsReceiptController {
    constructor(grService) {
        this.grService = grService;
    }
    findAll(status) {
        return this.grService.findAll(status);
    }
    findOne(id) {
        return this.grService.findOne(id);
    }
    findByPO(poId) {
        return this.grService.findByPO(poId);
    }
    findByQuotation(quotationId) {
        return this.grService.findByQuotation(quotationId);
    }
    getVarianceReport(id) {
        return this.grService.getVarianceReport(id);
    }
    create(dto, req) {
        return this.grService.create(dto, req.user.sub);
    }
    createFromPO(poId, dto, req) {
        return this.grService.createFromPO(poId, dto, req.user.sub);
    }
    post(id, req) {
        return this.grService.post(id, req.user.sub);
    }
    cancel(id, reason, req) {
        return this.grService.cancel(id, req.user.sub, reason);
    }
    reverse(id, reason, req) {
        return this.grService.reverse(id, req.user.sub, reason);
    }
};
exports.GoodsReceiptController = GoodsReceiptController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('purchase-order/:poId'),
    __param(0, (0, common_1.Param)('poId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "findByPO", null);
__decorate([
    (0, common_1.Get)('quotation/:quotationId'),
    __param(0, (0, common_1.Param)('quotationId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "findByQuotation", null);
__decorate([
    (0, common_1.Get)(':id/variance-report'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "getVarianceReport", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('from-po/:poId'),
    __param(0, (0, common_1.Param)('poId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "createFromPO", null);
__decorate([
    (0, common_1.Post)(':id/post'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "post", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/reverse'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "reverse", null);
exports.GoodsReceiptController = GoodsReceiptController = __decorate([
    (0, swagger_1.ApiTags)('Goods Receipts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('goods-receipts'),
    __metadata("design:paramtypes", [goods_receipt_service_1.GoodsReceiptService])
], GoodsReceiptController);
//# sourceMappingURL=goods-receipt.controller.js.map