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
exports.TempProductEntity = void 0;
const typeorm_1 = require("typeorm");
let TempProductEntity = class TempProductEntity {
};
exports.TempProductEntity = TempProductEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temp_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], TempProductEntity.prototype, "tempCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TempProductEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TempProductEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], TempProductEntity.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'ea' }),
    __metadata("design:type", String)
], TempProductEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "estimatedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quoted_price', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "quotedPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_quotation_id', nullable: true }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "sourceQuotationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_qt_item_id', nullable: true }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "sourceQtItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'PENDING' }),
    __metadata("design:type", String)
], TempProductEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activated_to_product_id', nullable: true }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "activatedToProductId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activated_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], TempProductEntity.prototype, "activatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activated_by', nullable: true }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "activatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activated_from_gr_id', nullable: true }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "activatedFromGrId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], TempProductEntity.prototype, "internalNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], TempProductEntity.prototype, "supplierNote", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TempProductEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TempProductEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], TempProductEntity.prototype, "updatedBy", void 0);
exports.TempProductEntity = TempProductEntity = __decorate([
    (0, typeorm_1.Entity)('temp_products')
], TempProductEntity);
//# sourceMappingURL=temp-product.entity.js.map