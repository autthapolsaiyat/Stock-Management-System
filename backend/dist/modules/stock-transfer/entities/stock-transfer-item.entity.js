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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTransferItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_transfer_entity_1 = require("./stock-transfer.entity");
let StockTransferItemEntity = class StockTransferItemEntity {
};
exports.StockTransferItemEntity = StockTransferItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_transfer_id' }),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "stockTransferId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no' }),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockTransferItemEntity.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_transfer_entity_1.StockTransferEntity, transfer => transfer.items),
    (0, typeorm_1.JoinColumn)({ name: 'stock_transfer_id' }),
    __metadata("design:type", stock_transfer_entity_1.StockTransferEntity)
], StockTransferItemEntity.prototype, "stockTransfer", void 0);
exports.StockTransferItemEntity = StockTransferItemEntity = __decorate([
    (0, typeorm_1.Entity)('stock_transfer_items')
], StockTransferItemEntity);
//# sourceMappingURL=stock-transfer-item.entity.js.map