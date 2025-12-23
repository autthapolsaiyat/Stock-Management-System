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
exports.StockAdjustmentController = void 0;
const common_1 = require("@nestjs/common");
const stock_adjustment_service_1 = require("./stock-adjustment.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StockAdjustmentController = class StockAdjustmentController {
    constructor(stockAdjustmentService) {
        this.stockAdjustmentService = stockAdjustmentService;
    }
    findAll() {
        return this.stockAdjustmentService.findAll();
    }
    getProductsForAdjustment(warehouseId) {
        return this.stockAdjustmentService.getProductsForAdjustment(Number(warehouseId));
    }
    findOne(id) {
        return this.stockAdjustmentService.findOne(Number(id));
    }
    create(dto, req) {
        return this.stockAdjustmentService.create(dto, req.user?.id);
    }
    post(id, req) {
        return this.stockAdjustmentService.post(Number(id), req.user?.id);
    }
    cancel(id, req) {
        return this.stockAdjustmentService.cancel(Number(id), req.user?.id);
    }
    delete(id) {
        return this.stockAdjustmentService.delete(Number(id));
    }
};
exports.StockAdjustmentController = StockAdjustmentController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockAdjustmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAdjustmentController.prototype, "getProductsForAdjustment", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAdjustmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StockAdjustmentController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/post'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockAdjustmentController.prototype, "post", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockAdjustmentController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAdjustmentController.prototype, "delete", null);
exports.StockAdjustmentController = StockAdjustmentController = __decorate([
    (0, common_1.Controller)('api/stock-adjustments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [stock_adjustment_service_1.StockAdjustmentService])
], StockAdjustmentController);
//# sourceMappingURL=stock-adjustment.controller.js.map