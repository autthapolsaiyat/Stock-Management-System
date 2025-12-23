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
    constructor(productRepository, categoryRepository, unitRepository, dataSource) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.unitRepository = unitRepository;
        this.dataSource = dataSource;
    }
    async findAll(categoryId, quotationType) {
        const where = { isActive: true };
        if (categoryId)
            where.categoryId = categoryId;
        if (quotationType)
            where.quotationType = quotationType;
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
    async getPriceHistory() {
        const query = `
      SELECT 
        qi.product_id as "productId",
        COUNT(DISTINCT q.id) as "salesCount",
        MIN(qi.unit_price) as "minPrice",
        MAX(qi.unit_price) as "maxPrice",
        AVG(qi.unit_price) as "avgPrice",
        EXTRACT(YEAR FROM q.doc_date) as "year"
      FROM quotation_items qi
      JOIN quotations q ON qi.quotation_id = q.id
      WHERE q.status IN ('APPROVED', 'COMPLETED', 'INVOICED', 'PAID')
        AND qi.product_id IS NOT NULL
        AND qi.source_type = 'MASTER'
      GROUP BY qi.product_id, EXTRACT(YEAR FROM q.doc_date)
      ORDER BY qi.product_id, "year" DESC
    `;
        const results = await this.dataSource.query(query);
        const priceHistory = {};
        for (const row of results) {
            const productId = row.productId;
            if (!priceHistory[productId]) {
                priceHistory[productId] = {
                    salesCount: 0,
                    minPrice: null,
                    maxPrice: null,
                    avgPrice: null,
                    yearlyData: [],
                };
            }
            priceHistory[productId].salesCount += parseInt(row.salesCount);
            const minPrice = parseFloat(row.minPrice);
            const maxPrice = parseFloat(row.maxPrice);
            if (priceHistory[productId].minPrice === null || minPrice < priceHistory[productId].minPrice) {
                priceHistory[productId].minPrice = minPrice;
            }
            if (priceHistory[productId].maxPrice === null || maxPrice > priceHistory[productId].maxPrice) {
                priceHistory[productId].maxPrice = maxPrice;
            }
            priceHistory[productId].yearlyData.push({
                year: parseInt(row.year),
                salesCount: parseInt(row.salesCount),
                minPrice: minPrice,
                maxPrice: maxPrice,
                avgPrice: parseFloat(row.avgPrice),
            });
        }
        for (const productId in priceHistory) {
            const data = priceHistory[productId];
            if (data.yearlyData.length > 0) {
                const totalAvg = data.yearlyData.reduce((sum, y) => sum + y.avgPrice * y.salesCount, 0);
                data.avgPrice = totalAvg / data.salesCount;
            }
        }
        return priceHistory;
    }
    async getProductPriceHistory(productId) {
        const query = `
      SELECT 
        qi.unit_price as "unitPrice",
        qi.qty,
        qi.line_total as "lineTotal",
        q.doc_full_no as "docNo",
        q.doc_date as "docDate",
        q.status,
        c.name as "customerName"
      FROM quotation_items qi
      JOIN quotations q ON qi.quotation_id = q.id
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.status IN ('APPROVED', 'COMPLETED', 'INVOICED', 'PAID')
        AND qi.product_id = $1
        AND qi.source_type = 'MASTER'
      ORDER BY q.doc_date DESC
      LIMIT 20
    `;
        const results = await this.dataSource.query(query, [productId]);
        const summary = {
            salesCount: results.length,
            minPrice: results.length > 0 ? Math.min(...results.map((r) => parseFloat(r.unitPrice))) : 0,
            maxPrice: results.length > 0 ? Math.max(...results.map((r) => parseFloat(r.unitPrice))) : 0,
            avgPrice: results.length > 0
                ? results.reduce((sum, r) => sum + parseFloat(r.unitPrice), 0) / results.length
                : 0,
            lastPrice: results.length > 0 ? parseFloat(results[0].unitPrice) : 0,
            history: results.map((r) => ({
                unitPrice: parseFloat(r.unitPrice),
                qty: parseFloat(r.qty),
                lineTotal: parseFloat(r.lineTotal),
                docNo: r.docNo,
                docDate: r.docDate,
                customerName: r.customerName,
            })),
        };
        return summary;
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
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ProductService);
//# sourceMappingURL=product.service.js.map