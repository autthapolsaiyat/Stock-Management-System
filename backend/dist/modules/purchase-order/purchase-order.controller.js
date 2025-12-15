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
exports.PurchaseOrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const purchase_order_service_1 = require("./purchase-order.service");
let PurchaseOrderController = class PurchaseOrderController {
    constructor(poService) {
        this.poService = poService;
    }
    findAll(status) {
        return this.poService.findAll(status);
    }
    findOne(id) {
        return this.poService.findOne(id);
    }
    findByQuotation(quotationId) {
        return this.poService.findByQuotation(quotationId);
    }
    getItemsForGR(id) {
        return this.poService.getItemsForGR(id);
    }
    create(dto, req) {
        return this.poService.create(dto, req.user.sub);
    }
    createFromQuotation(quotationId, dto, req) {
        return this.poService.createFromQuotation(quotationId, dto.supplierId, dto, req.user.sub);
    }
    update(id, dto, req) {
        return this.poService.update(id, dto, req.user.sub);
    }
    submitForApproval(id, req) {
        return this.poService.submitForApproval(id, req.user.sub);
    }
    approve(id, note, req) {
        return this.poService.approve(id, req.user.sub, note);
    }
    send(id, req) {
        return this.poService.send(id, req.user.sub);
    }
    cancel(id, reason, req) {
        return this.poService.cancel(id, req.user.sub, reason);
    }
};
exports.PurchaseOrderController = PurchaseOrderController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('quotation/:quotationId'),
    __param(0, (0, common_1.Param)('quotationId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "findByQuotation", null);
__decorate([
    (0, common_1.Get)(':id/items-for-gr'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "getItemsForGR", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('from-quotation/:quotationId'),
    __param(0, (0, common_1.Param)('quotationId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "createFromQuotation", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "submitForApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('note')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "send", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrderController.prototype, "cancel", null);
exports.PurchaseOrderController = PurchaseOrderController = __decorate([
    (0, swagger_1.ApiTags)('Purchase Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('purchase-orders'),
    __metadata("design:paramtypes", [purchase_order_service_1.PurchaseOrderService])
], PurchaseOrderController);
//# sourceMappingURL=purchase-order.controller.js.map