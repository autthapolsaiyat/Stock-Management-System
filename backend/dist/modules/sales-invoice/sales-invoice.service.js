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
const quotation_service_1 = require("../quotation/quotation.service");
const system_settings_service_1 = require("../system-settings/system-settings.service");
let SalesInvoiceService = class SalesInvoiceService {
    constructor(invoiceRepository, itemRepository, docNumberingService, fifoService, quotationService, settingsService, dataSource) {
        this.invoiceRepository = invoiceRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.fifoService = fifoService;
        this.quotationService = quotationService;
        this.settingsService = settingsService;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        return this.invoiceRepository.find({
            where,
            order: { createdAt: 'DESC' },
            relations: ['items'],
        });
    }
    async findOne(id) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['items'],
        });
        if (!invoice)
            throw new common_1.NotFoundException('Sales invoice not found');
        return invoice;
    }
    async findByQuotation(quotationId) {
        return this.invoiceRepository.find({
            where: { quotationId, isLatestRevision: true },
            relations: ['items'],
            order: { createdAt: 'DESC' },
        });
    }
    async create(dto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('INV', queryRunner);
            const varianceThreshold = await this.settingsService.getVarianceAlertPercent();
            const invoice = queryRunner.manager.create(entities_1.SalesInvoiceEntity, {
                docBaseNo,
                docFullNo,
                docRevision: 1,
                isLatestRevision: true,
                quotationId: dto.quotationId,
                quotationDocNo: dto.quotationDocNo,
                customerId: dto.customerId,
                customerName: dto.customerName,
                customerAddress: dto.customerAddress,
                contactPerson: dto.contactPerson,
                warehouseId: dto.warehouseId,
                warehouseName: dto.warehouseName,
                docDate: dto.docDate || new Date(),
                dueDate: dto.dueDate,
                creditTermDays: dto.creditTermDays || 30,
                publicNote: dto.publicNote,
                internalNote: dto.internalNote,
                remark: dto.remark,
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedInvoice = await queryRunner.manager.save(invoice);
            let subtotal = 0;
            let costTotal = 0;
            let hasPriceVariance = false;
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                const netPrice = item.unitPrice - (item.discountAmount || 0);
                const lineTotal = item.qty * netPrice;
                subtotal += lineTotal;
                const quotedPrice = item.quotedPrice || item.unitPrice;
                const priceVariance = item.unitPrice - quotedPrice;
                const priceVariancePercent = quotedPrice > 0 ? (priceVariance / quotedPrice) * 100 : 0;
                const itemHasVariance = Math.abs(priceVariancePercent) > varianceThreshold;
                if (itemHasVariance)
                    hasPriceVariance = true;
                const invoiceItem = queryRunner.manager.create(entities_1.SalesInvoiceItemEntity, {
                    salesInvoiceId: savedInvoice.id,
                    lineNo: i + 1,
                    quotationItemId: item.quotationItemId,
                    productId: item.productId,
                    itemCode: item.itemCode,
                    itemName: item.itemName,
                    itemDescription: item.itemDescription,
                    brand: item.brand,
                    qty: item.qty,
                    unit: item.unit || 'ea',
                    unitPrice: item.unitPrice,
                    discountPercent: item.discountPercent || 0,
                    discountAmount: item.discountAmount || 0,
                    netPrice: netPrice,
                    lineTotal: lineTotal,
                    quotedPrice: quotedPrice,
                    priceVariance: priceVariance,
                    priceVariancePercent: priceVariancePercent,
                    hasPriceVariance: itemHasVariance,
                    priceAdjustmentReason: item.priceAdjustmentReason,
                    internalNote: item.internalNote,
                });
                await queryRunner.manager.save(invoiceItem);
            }
            const discountTotal = dto.discountTotal || (subtotal * (dto.discountPercent || 0) / 100);
            const afterDiscount = subtotal - discountTotal;
            const taxAmount = afterDiscount * (dto.taxRate || 7) / 100;
            const grandTotal = afterDiscount + taxAmount;
            savedInvoice.subtotal = subtotal;
            savedInvoice.discountPercent = dto.discountPercent || 0;
            savedInvoice.discountTotal = discountTotal;
            savedInvoice.afterDiscount = afterDiscount;
            savedInvoice.taxRate = dto.taxRate || 7;
            savedInvoice.taxAmount = taxAmount;
            savedInvoice.grandTotal = grandTotal;
            savedInvoice.hasPriceVariance = hasPriceVariance;
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
    async createFromQuotation(quotationId, dto, userId) {
        const quotation = await this.quotationService.findOne(quotationId);
        if (!['APPROVED', 'SENT', 'CONFIRMED', 'PARTIALLY_CLOSED'].includes(quotation.status)) {
            throw new common_1.BadRequestException('Quotation must be approved before creating invoice');
        }
        const readyItems = quotation.items.filter(item => item.itemStatus !== 'CANCELLED' &&
            item.qty > 0 &&
            item.qtySold < item.qty &&
            (!dto.itemIds || dto.itemIds.includes(item.id)));
        if (readyItems.length === 0) {
            throw new common_1.BadRequestException('No items ready for invoicing');
        }
        const invoiceDto = {
            quotationId: quotation.id,
            quotationDocNo: quotation.docFullNo,
            customerId: quotation.customerId,
            customerName: quotation.customerName,
            customerAddress: quotation.customerAddress,
            contactPerson: quotation.contactPerson,
            warehouseId: dto.warehouseId,
            warehouseName: dto.warehouseName,
            docDate: dto.docDate || new Date(),
            dueDate: dto.dueDate || new Date(Date.now() + quotation.creditTermDays * 24 * 60 * 60 * 1000),
            creditTermDays: quotation.creditTermDays,
            publicNote: dto.publicNote,
            internalNote: dto.internalNote,
            remark: dto.remark,
            items: readyItems.map(item => {
                const qtyToInvoice = dto.quantities?.[item.id] || (item.qty - item.qtySold);
                return {
                    quotationItemId: item.id,
                    productId: item.productId,
                    itemCode: item.itemCode,
                    itemName: item.itemName,
                    itemDescription: item.itemDescription,
                    brand: item.brand,
                    qty: qtyToInvoice,
                    unit: item.unit,
                    unitPrice: dto.prices?.[item.id] || item.unitPrice,
                    quotedPrice: item.unitPrice,
                    discountAmount: item.discountAmount,
                    priceAdjustmentReason: dto.priceReasons?.[item.id],
                };
            }),
        };
        return this.create(invoiceDto, userId);
    }
    async approvePriceVariance(id, userId) {
        const invoice = await this.findOne(id);
        if (!invoice.hasPriceVariance) {
            throw new common_1.BadRequestException('Invoice has no price variance');
        }
        invoice.priceVarianceApproved = true;
        invoice.priceVarianceApprovedBy = userId;
        invoice.priceVarianceApprovedAt = new Date();
        invoice.updatedBy = userId;
        return this.invoiceRepository.save(invoice);
    }
    async post(id, userId) {
        const invoice = await this.findOne(id);
        if (invoice.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only draft invoices can be posted');
        }
        if (invoice.hasPriceVariance && !invoice.priceVarianceApproved) {
            throw new common_1.BadRequestException('Price variance must be approved before posting');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalCost = 0;
            for (const item of invoice.items) {
                const deductResult = await this.fifoService.deductFifo(item.productId, invoice.warehouseId, Number(item.qty), 'INV', invoice.id, item.id, queryRunner);
                const unitCost = deductResult.totalCost / Number(item.qty);
                const costItemTotal = deductResult.totalCost;
                const profitAmount = Number(item.lineTotal) - costItemTotal;
                const profitPercent = Number(item.lineTotal) > 0 ? (profitAmount / Number(item.lineTotal)) * 100 : 0;
                item.unitCost = unitCost;
                item.costTotal = costItemTotal;
                item.profitAmount = profitAmount;
                item.profitPercent = profitPercent;
                await queryRunner.manager.save(item);
                totalCost += costItemTotal;
                if (item.quotationItemId) {
                    await queryRunner.manager.query(`
            UPDATE quotation_items 
            SET qty_sold = qty_sold + $1,
                qty_remaining = GREATEST(0, qty_remaining - $1),
                invoice_price = $2,
                item_status = CASE 
                  WHEN qty_remaining - $1 <= 0 THEN 'SOLD'
                  ELSE 'PARTIAL'
                END,
                invoice_item_id = $3
            WHERE id = $4
          `, [item.qty, item.unitPrice, item.id, item.quotationItemId]);
                }
            }
            const profitTotal = Number(invoice.subtotal) - totalCost;
            const profitPercent = Number(invoice.subtotal) > 0 ? (profitTotal / Number(invoice.subtotal)) * 100 : 0;
            invoice.costTotal = totalCost;
            invoice.profitTotal = profitTotal;
            invoice.profitPercent = profitPercent;
            invoice.status = 'POSTED';
            invoice.postedAt = new Date();
            invoice.postedBy = userId;
            invoice.updatedBy = userId;
            await queryRunner.manager.save(invoice);
            if (invoice.quotationId) {
                await this.quotationService.updateFulfillmentSummary(invoice.quotationId);
            }
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
    async cancel(id, userId, reason) {
        const invoice = await this.findOne(id);
        if (invoice.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Invoice is already cancelled');
        }
        if (invoice.status === 'POSTED') {
            throw new common_1.BadRequestException('Posted invoice cannot be cancelled');
        }
        invoice.status = 'CANCELLED';
        invoice.cancelledAt = new Date();
        invoice.cancelledBy = userId;
        invoice.cancelReason = reason;
        invoice.updatedBy = userId;
        return this.invoiceRepository.save(invoice);
    }
    async markPaid(id, userId, dto) {
        const invoice = await this.findOne(id);
        if (invoice.status !== 'POSTED') {
            throw new common_1.BadRequestException('Invoice must be posted before marking as paid');
        }
        invoice.status = 'PAID';
        invoice.paidAt = new Date();
        invoice.paidBy = userId;
        invoice.paidAmount = dto?.paidAmount || invoice.grandTotal;
        invoice.paymentMethod = dto?.paymentMethod || 'TRANSFER';
        invoice.paymentReference = dto?.paymentReference;
        invoice.updatedBy = userId;
        return this.invoiceRepository.save(invoice);
    }
    async getProfitReport(id) {
        const invoice = await this.findOne(id);
        return {
            invoice: {
                id: invoice.id,
                docFullNo: invoice.docFullNo,
                customerName: invoice.customerName,
                subtotal: invoice.subtotal,
                costTotal: invoice.costTotal,
                profitTotal: invoice.profitTotal,
                profitPercent: invoice.profitPercent,
            },
            items: invoice.items.map(item => ({
                itemName: item.itemName,
                qty: item.qty,
                unitPrice: item.unitPrice,
                lineTotal: item.lineTotal,
                unitCost: item.unitCost,
                costTotal: item.costTotal,
                profitAmount: item.profitAmount,
                profitPercent: item.profitPercent,
            })),
        };
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
        quotation_service_1.QuotationService,
        system_settings_service_1.SystemSettingsService,
        typeorm_2.DataSource])
], SalesInvoiceService);
//# sourceMappingURL=sales-invoice.service.js.map