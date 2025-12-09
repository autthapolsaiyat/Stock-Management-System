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
exports.FifoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const fifo_service_1 = require("./fifo.service");
let FifoController = class FifoController {
    constructor(fifoService) {
        this.fifoService = fifoService;
    }
    getBalance(productId, warehouseId) {
        return this.fifoService.getStockBalance(productId, warehouseId);
    }
    getFifoLayers(productId, warehouseId) {
        return this.fifoService.getFifoLayers(productId, warehouseId);
    }
};
exports.FifoController = FifoController;
__decorate([
    (0, common_1.Get)('balance'),
    (0, swagger_1.ApiQuery)({ name: 'productId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'warehouseId', required: false }),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], FifoController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('fifo-layers'),
    (0, swagger_1.ApiQuery)({ name: 'productId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'warehouseId', required: false }),
    __param(0, (0, common_1.Query)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], FifoController.prototype, "getFifoLayers", null);
exports.FifoController = FifoController = __decorate([
    (0, swagger_1.ApiTags)('FIFO & Stock'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('stock'),
    __metadata("design:paramtypes", [fifo_service_1.FifoService])
], FifoController);
//# sourceMappingURL=fifo.controller.js.map