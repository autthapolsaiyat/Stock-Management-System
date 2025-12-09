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
exports.QuotationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const doc_numbering_service_1 = require("../doc-numbering/doc-numbering.service");
let QuotationService = class QuotationService {
    constructor(quotationRepository, itemRepository, docNumberingService, dataSource) {
        this.quotationRepository = quotationRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        return this.quotationRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
    }
    async findOne(id) {
        const quotation = await this.quotationRepository.findOne({ where: { id }, relations: ['items'] });
        if (!quotation)
            throw new common_1.NotFoundException('Quotation not found');
        return quotation;
    }
    async create(dto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('QT', queryRunner);
            const quotation = queryRunner.manager.create(entities_1.QuotationEntity, {
                docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
                docDate: dto.docDate || new Date(),
                validUntil: dto.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                customerId: dto.customerId,
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedQuotation = await queryRunner.manager.save(quotation);
            let subtotal = 0;
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                const lineTotal = item.qty * item.unitPrice - (item.discountAmount || 0);
                subtotal += lineTotal;
                const quotationItem = queryRunner.manager.create(entities_1.QuotationItemEntity, {
                    quotationId: savedQuotation.id,
                    lineNo: i + 1,
                    productId: item.productId,
                    qty: item.qty,
                    unitPrice: item.unitPrice,
                    discountAmount: item.discountAmount || 0,
                    lineTotal,
                });
                await queryRunner.manager.save(quotationItem);
            }
            savedQuotation.subtotal = subtotal;
            savedQuotation.taxAmount = subtotal * 0.07;
            savedQuotation.grandTotal = subtotal * 1.07;
            await queryRunner.manager.save(savedQuotation);
            await queryRunner.commitTransaction();
            return this.findOne(savedQuotation.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async confirm(id, userId) {
        const quotation = await this.findOne(id);
        if (quotation.status !== 'DRAFT')
            throw new common_1.BadRequestException('Only draft quotations can be confirmed');
        quotation.status = 'CONFIRMED';
        quotation.confirmedAt = new Date();
        quotation.confirmedBy = userId;
        return this.quotationRepository.save(quotation);
    }
    async cancel(id, userId) {
        const quotation = await this.findOne(id);
        if (quotation.status === 'CANCELLED')
            throw new common_1.BadRequestException('Already cancelled');
        quotation.status = 'CANCELLED';
        quotation.cancelledAt = new Date();
        quotation.cancelledBy = userId;
        return this.quotationRepository.save(quotation);
    }
};
exports.QuotationService = QuotationService;
exports.QuotationService = QuotationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.QuotationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.QuotationItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        doc_numbering_service_1.DocNumberingService,
        typeorm_2.DataSource])
], QuotationService);
//# sourceMappingURL=quotation.service.js.map