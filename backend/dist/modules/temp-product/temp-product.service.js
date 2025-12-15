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
exports.TempProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
let TempProductService = class TempProductService {
    constructor(tempProductRepository, dataSource) {
        this.tempProductRepository = tempProductRepository;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = {};
        if (status)
            where.status = status;
        return this.tempProductRepository.find({ where, order: { createdAt: 'DESC' } });
    }
    async findByQuotation(quotationId) {
        return this.tempProductRepository.find({
            where: { sourceQuotationId: quotationId },
            order: { createdAt: 'ASC' }
        });
    }
    async findOne(id) {
        const tempProduct = await this.tempProductRepository.findOne({ where: { id } });
        if (!tempProduct)
            throw new common_1.NotFoundException('Temp product not found');
        return tempProduct;
    }
    async generateTempCode() {
        const now = new Date();
        const yymm = now.getFullYear().toString().slice(-2) + (now.getMonth() + 1).toString().padStart(2, '0');
        const lastTemp = await this.tempProductRepository
            .createQueryBuilder('tp')
            .where('tp.temp_code LIKE :prefix', { prefix: `TEMP-${yymm}-%` })
            .orderBy('tp.id', 'DESC')
            .getOne();
        let seq = 1;
        if (lastTemp) {
            const lastSeq = parseInt(lastTemp.tempCode.split('-')[2], 10);
            seq = lastSeq + 1;
        }
        return `TEMP-${yymm}-${seq.toString().padStart(3, '0')}`;
    }
    async create(dto, userId) {
        const tempCode = await this.generateTempCode();
        const tempProduct = this.tempProductRepository.create({
            tempCode,
            name: dto.name,
            description: dto.description,
            brand: dto.brand,
            unit: dto.unit || 'ea',
            estimatedCost: dto.estimatedCost || 0,
            quotedPrice: dto.quotedPrice || 0,
            sourceQuotationId: dto.sourceQuotationId,
            sourceQtItemId: dto.sourceQtItemId,
            internalNote: dto.internalNote,
            supplierNote: dto.supplierNote,
            status: 'PENDING',
            createdBy: userId,
        });
        return this.tempProductRepository.save(tempProduct);
    }
    async update(id, dto, userId) {
        const tempProduct = await this.findOne(id);
        if (tempProduct.status !== 'PENDING') {
            throw new common_1.BadRequestException('Cannot update activated or cancelled temp product');
        }
        Object.assign(tempProduct, {
            name: dto.name ?? tempProduct.name,
            description: dto.description ?? tempProduct.description,
            brand: dto.brand ?? tempProduct.brand,
            unit: dto.unit ?? tempProduct.unit,
            estimatedCost: dto.estimatedCost ?? tempProduct.estimatedCost,
            quotedPrice: dto.quotedPrice ?? tempProduct.quotedPrice,
            internalNote: dto.internalNote ?? tempProduct.internalNote,
            supplierNote: dto.supplierNote ?? tempProduct.supplierNote,
            updatedBy: userId,
        });
        return this.tempProductRepository.save(tempProduct);
    }
    async activate(id, dto, userId) {
        const tempProduct = await this.findOne(id);
        if (tempProduct.status !== 'PENDING') {
            throw new common_1.BadRequestException('Temp product is not pending');
        }
        tempProduct.status = 'ACTIVATED';
        tempProduct.activatedToProductId = dto.newProductId;
        tempProduct.activatedFromGrId = dto.grId;
        tempProduct.activatedAt = new Date();
        tempProduct.activatedBy = userId;
        tempProduct.updatedBy = userId;
        return this.tempProductRepository.save(tempProduct);
    }
    async cancel(id, userId) {
        const tempProduct = await this.findOne(id);
        if (tempProduct.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only pending temp products can be cancelled');
        }
        tempProduct.status = 'CANCELLED';
        tempProduct.updatedBy = userId;
        return this.tempProductRepository.save(tempProduct);
    }
};
exports.TempProductService = TempProductService;
exports.TempProductService = TempProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TempProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], TempProductService);
//# sourceMappingURL=temp-product.service.js.map