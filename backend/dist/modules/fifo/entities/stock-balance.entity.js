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
exports.StockBalanceEntity = void 0;
const typeorm_1 = require("typeorm");
let StockBalanceEntity = class StockBalanceEntity {
    get qtyAvailable() {
        return Number(this.qtyOnHand) - Number(this.qtyReserved);
    }
};
exports.StockBalanceEntity = StockBalanceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockBalanceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], StockBalanceEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], StockBalanceEntity.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_on_hand', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockBalanceEntity.prototype, "qtyOnHand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_reserved', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockBalanceEntity.prototype, "qtyReserved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avg_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockBalanceEntity.prototype, "avgCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_received_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockBalanceEntity.prototype, "lastReceivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_issued_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockBalanceEntity.prototype, "lastIssuedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockBalanceEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StockBalanceEntity.prototype, "updatedAt", void 0);
exports.StockBalanceEntity = StockBalanceEntity = __decorate([
    (0, typeorm_1.Entity)('stock_balances'),
    (0, typeorm_1.Unique)(['productId', 'warehouseId'])
], StockBalanceEntity);
//# sourceMappingURL=stock-balance.entity.js.map