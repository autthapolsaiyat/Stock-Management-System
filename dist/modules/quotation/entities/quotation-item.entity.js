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
exports.QuotationItemEntity = void 0;
const typeorm_1 = require("typeorm");
const quotation_entity_1 = require("./quotation.entity");
let QuotationItemEntity = class QuotationItemEntity {
};
exports.QuotationItemEntity = QuotationItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quotation_id' }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "quotationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no' }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], QuotationItemEntity.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quotation_entity_1.QuotationEntity, quotation => quotation.items),
    (0, typeorm_1.JoinColumn)({ name: 'quotation_id' }),
    __metadata("design:type", quotation_entity_1.QuotationEntity)
], QuotationItemEntity.prototype, "quotation", void 0);
exports.QuotationItemEntity = QuotationItemEntity = __decorate([
    (0, typeorm_1.Entity)('quotation_items')
], QuotationItemEntity);
//# sourceMappingURL=quotation-item.entity.js.map