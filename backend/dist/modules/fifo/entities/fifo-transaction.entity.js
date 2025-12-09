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
exports.FifoTransactionEntity = void 0;
const typeorm_1 = require("typeorm");
let FifoTransactionEntity = class FifoTransactionEntity {
};
exports.FifoTransactionEntity = FifoTransactionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FifoTransactionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fifo_layer_id' }),
    __metadata("design:type", Number)
], FifoTransactionEntity.prototype, "fifoLayerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], FifoTransactionEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], FifoTransactionEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_cost', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], FifoTransactionEntity.prototype, "totalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_type', length: 10 }),
    __metadata("design:type", String)
], FifoTransactionEntity.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', length: 20 }),
    __metadata("design:type", String)
], FifoTransactionEntity.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", Number)
], FifoTransactionEntity.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_item_id', nullable: true }),
    __metadata("design:type", Number)
], FifoTransactionEntity.prototype, "referenceItemId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], FifoTransactionEntity.prototype, "createdAt", void 0);
exports.FifoTransactionEntity = FifoTransactionEntity = __decorate([
    (0, typeorm_1.Entity)('fifo_transactions')
], FifoTransactionEntity);
//# sourceMappingURL=fifo-transaction.entity.js.map