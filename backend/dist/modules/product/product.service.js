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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const product_category_entity_1 = require("./entities/product-category.entity");
const unit_entity_1 = require("./entities/unit.entity");
let ProductService = class ProductService {
    constructor(productRepository, categoryRepository, unitRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.unitRepository = unitRepository;
    }
    async findAll(categoryId) {
        const where = { isActive: true };
        if (categoryId)
            where.categoryId = categoryId;
        return this.productRepository.find({ where, relations: ['category', 'unit'], order: { id: 'DESC' } });
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['category', 'unit'] });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async create(dto) {
        const existing = await this.productRepository.findOne({ where: { code: dto.code } });
        if (existing)
            throw new common_1.ConflictException('Product code already exists');
        const product = this.productRepository.create({ ...dto, isActive: true });
        const savedProduct = await this.productRepository.save(product);
        return this.findOne(savedProduct.id);
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        Object.assign(product, dto);
        await this.productRepository.save(product);
        return this.findOne(id);
    }
    async delete(id) {
        const product = await this.findOne(id);
        product.isActive = false;
        return this.productRepository.save(product);
    }
    async findAllCategories() {
        return this.categoryRepository.find({ where: { isActive: true } });
    }
    async createCategory(dto) {
        const category = this.categoryRepository.create({ ...dto, isActive: true });
        return this.categoryRepository.save(category);
    }
    async findAllUnits() {
        return this.unitRepository.find({ where: { isActive: true } });
    }
    async createUnit(dto) {
        const existing = await this.unitRepository.findOne({ where: { name: dto.name } });
        if (existing)
            throw new common_1.ConflictException('Unit name already exists');
        const unit = this.unitRepository.create({ ...dto, isActive: true });
        return this.unitRepository.save(unit);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_category_entity_1.ProductCategoryEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(unit_entity_1.UnitEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map