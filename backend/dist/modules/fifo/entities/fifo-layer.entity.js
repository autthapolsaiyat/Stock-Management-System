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
exports.FifoLayerEntity = void 0;
const typeorm_1 = require("typeorm");
let FifoLayerEntity = class FifoLayerEntity {
};
exports.FifoLayerEntity = FifoLayerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FifoLayerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], FifoLayerEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], FifoLayerEntity.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_original', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], FifoLayerEntity.prototype, "qtyOriginal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_remaining', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], FifoLayerEntity.prototype, "qtyRemaining", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], FifoLayerEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], FifoLayerEntity.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", Number)
], FifoLayerEntity.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_item_id', nullable: true }),
    __metadata("design:type", Number)
], FifoLayerEntity.prototype, "referenceItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], FifoLayerEntity.prototype, "receivedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FifoLayerEntity.prototype, "createdAt", void 0);
exports.FifoLayerEntity = FifoLayerEntity = __decorate([
    (0, typeorm_1.Entity)('fifo_layers')
], FifoLayerEntity);
//# sourceMappingURL=fifo-layer.entity.js.map