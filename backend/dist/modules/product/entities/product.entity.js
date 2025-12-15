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
exports.ProductEntity = void 0;
const typeorm_1 = require("typeorm");
const product_category_entity_1 = require("./product-category.entity");
const unit_entity_1 = require("./unit.entity");
let ProductEntity = class ProductEntity {
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', nullable: true }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_id', nullable: true }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_stock', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "minStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_stock', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "maxStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reorder_point', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "reorderPoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'standard_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "standardCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'selling_price', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "sellingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], ProductEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_category_entity_1.ProductCategoryEntity),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", product_category_entity_1.ProductCategoryEntity)
], ProductEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.UnitEntity),
    (0, typeorm_1.JoinColumn)({ name: 'unit_id' }),
    __metadata("design:type", unit_entity_1.UnitEntity)
], ProductEntity.prototype, "unit", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, typeorm_1.Entity)('products')
], ProductEntity);
//# sourceMappingURL=product.entity.js.map