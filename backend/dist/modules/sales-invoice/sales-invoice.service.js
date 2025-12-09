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
exports.SalesInvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const doc_numbering_service_1 = require("../doc-numbering/doc-numbering.service");
const fifo_service_1 = require("../fifo/fifo.service");
let SalesInvoiceService = class SalesInvoiceService {
    constructor(invoiceRepository, itemRepository, docNumberingService, fifoService, dataSource) {
        this.invoiceRepository = invoiceRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.fifoService = fifoService;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        return this.invoiceRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
    }
    async findOne(id) {
        const invoice = await this.invoiceRepository.findOne({ where: { id }, relations: ['items'] });
        if (!invoice)
            throw new common_1.NotFoundException('Sales Invoice not found');
        return invoice;
    }
    async create(dto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('SI', queryRunner);
            const invoice = queryRunner.manager.create(entities_1.SalesInvoiceEntity, {
                docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
                docDate: dto.docDate || new Date(),
                customerId: dto.customerId,
                warehouseId: dto.warehouseId,
                quotationId: dto.quotationId,
                dueDate: dto.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedInvoice = await queryRunner.manager.save(invoice);
            let subtotal = 0;
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                const lineTotal = item.qty * item.unitPrice - (item.discountAmount || 0);
                subtotal += lineTotal;
                const invoiceItem = queryRunner.manager.create(entities_1.SalesInvoiceItemEntity, {
                    salesInvoiceId: savedInvoice.id,
                    lineNo: i + 1,
                    productId: item.productId,
                    qty: item.qty,
                    unitPrice: item.unitPrice,
                    discountAmount: item.discountAmount || 0,
                    lineTotal,
                });
                await queryRunner.manager.save(invoiceItem);
            }
            savedInvoice.subtotal = subtotal;
            savedInvoice.taxAmount = subtotal * 0.07;
            savedInvoice.grandTotal = subtotal * 1.07;
            await queryRunner.manager.save(savedInvoice);
            await queryRunner.commitTransaction();
            return this.findOne(savedInvoice.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async post(id, userId) {
        const invoice = await this.findOne(id);
        if (invoice.status !== 'DRAFT')
            throw new common_1.BadRequestException('Only draft can be posted');
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalCost = 0;
            for (const item of invoice.items) {
                const result = await this.fifoService.deductFifo(item.productId, invoice.warehouseId, Number(item.qty), 'INVOICE', invoice.id, item.id, queryRunner);
                item.unitCost = result.totalCost / Number(item.qty);
                item.costTotal = result.totalCost;
                totalCost += result.totalCost;
                await queryRunner.manager.save(item);
            }
            invoice.costTotal = totalCost;
            invoice.profitTotal = Number(invoice.subtotal) - totalCost;
            invoice.status = 'POSTED';
            invoice.postedAt = new Date();
            invoice.postedBy = userId;
            await queryRunner.manager.save(invoice);
            await queryRunner.commitTransaction();
            return this.findOne(id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async cancel(id, userId) {
        const invoice = await this.findOne(id);
        if (invoice.status === 'POSTED')
            throw new common_1.BadRequestException('Posted invoice cannot be cancelled');
        invoice.status = 'CANCELLED';
        invoice.cancelledAt = new Date();
        invoice.cancelledBy = userId;
        return this.invoiceRepository.save(invoice);
    }
};
exports.SalesInvoiceService = SalesInvoiceService;
exports.SalesInvoiceService = SalesInvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.SalesInvoiceEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.SalesInvoiceItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        doc_numbering_service_1.DocNumberingService,
        fifo_service_1.FifoService,
        typeorm_2.DataSource])
], SalesInvoiceService);
//# sourceMappingURL=sales-invoice.service.js.map