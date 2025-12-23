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
exports.StockCountController = void 0;
const common_1 = require("@nestjs/common");
const stock_count_service_1 = require("./stock-count.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StockCountController = class StockCountController {
    constructor(stockCountService) {
        this.stockCountService = stockCountService;
    }
    findAll() {
        return this.stockCountService.findAll();
    }
    findOne(id) {
        return this.stockCountService.findOne(Number(id));
    }
    create(dto, req) {
        return this.stockCountService.create(dto, req.user?.id);
    }
    startCount(id, req) {
        return this.stockCountService.startCount(Number(id), req.user?.id);
    }
    updateItemCount(id, itemId, dto, req) {
        return this.stockCountService.updateItemCount(Number(id), Number(itemId), dto, req.user?.id);
    }
    complete(id, req) {
        return this.stockCountService.complete(Number(id), req.user?.id);
    }
    approve(id, req) {
        return this.stockCountService.approve(Number(id), req.user?.id);
    }
    createAdjustment(id, req) {
        return this.stockCountService.createAdjustment(Number(id), req.user?.id);
    }
    delete(id) {
        return this.stockCountService.delete(Number(id));
    }
};
exports.StockCountController = StockCountController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "startCount", null);
__decorate([
    (0, common_1.Post)(':id/items/:itemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "updateItemCount", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/create-adjustment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "createAdjustment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockCountController.prototype, "delete", null);
exports.StockCountController = StockCountController = __decorate([
    (0, common_1.Controller)('api/stock-counts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [stock_count_service_1.StockCountService])
], StockCountController);
//# sourceMappingURL=stock-count.controller.js.map