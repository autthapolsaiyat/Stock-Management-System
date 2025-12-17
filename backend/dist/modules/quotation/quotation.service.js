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
const temp_product_service_1 = require("../temp-product/temp-product.service");
const system_settings_service_1 = require("../system-settings/system-settings.service");
let QuotationService = class QuotationService {
    constructor(quotationRepository, itemRepository, docNumberingService, tempProductService, settingsService, dataSource) {
        this.quotationRepository = quotationRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.tempProductService = tempProductService;
        this.settingsService = settingsService;
        this.dataSource = dataSource;
    }
    async findAll(status, qtType) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        if (qtType)
            where.qtType = qtType;
        return this.quotationRepository.find({
            where,
            order: { createdAt: 'DESC' },
            relations: ['items']
        });
    }
    async findOne(id) {
        const quotation = await this.quotationRepository.findOne({
            where: { id },
            relations: ['items']
        });
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
            const minMargin = await this.settingsService.getMinMarginPercent();
            const quotation = queryRunner.manager.create(entities_1.QuotationEntity, {
                docBaseNo,
                docFullNo,
                docRevision: 1,
                isLatestRevision: true,
                qtType: dto.qtType || 'STANDARD',
                docDate: dto.docDate || new Date(),
                validUntil: dto.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                priceValidityDays: dto.priceValidityDays || 30,
                deliveryDays: dto.deliveryDays || 120,
                creditTermDays: dto.creditTermDays || 30,
                customerId: dto.customerId,
                customerName: dto.customerName,
                customerAddress: dto.customerAddress,
                contactPerson: dto.contactPerson,
                salesPersonId: dto.salesPersonId || userId,
                salesPersonName: dto.salesPersonName,
                paymentTermsText: dto.paymentTermsText,
                deliveryTerms: dto.deliveryTerms,
                publicNote: dto.publicNote,
                internalNote: dto.internalNote,
                remark: dto.remark,
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedQuotation = await queryRunner.manager.save(quotation);
            let subtotal = 0;
            let totalEstimatedCost = 0;
            let hasLowMargin = false;
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                let tempProductId = null;
                let itemCode = item.itemCode;
                let itemName = item.itemName;
                if (item.sourceType === 'TEMP' && !item.tempProductId) {
                    const tempProduct = await this.tempProductService.create({
                        name: item.itemName,
                        brand: item.brand,
                        unit: item.unit,
                        estimatedCost: item.estimatedCost || 0,
                        quotedPrice: item.unitPrice,
                        sourceQuotationId: savedQuotation.id,
                        internalNote: item.internalNote,
                    }, userId);
                    tempProductId = tempProduct.id;
                    itemCode = tempProduct.tempCode;
                }
                else if (item.sourceType === 'TEMP') {
                    tempProductId = item.tempProductId;
                }
                const netPrice = item.unitPrice - (item.discountAmount || 0);
                const lineTotal = item.qty * netPrice;
                const estimatedCost = item.estimatedCost || 0;
                const marginAmount = netPrice - estimatedCost;
                const marginPercent = netPrice > 0 ? (marginAmount / netPrice) * 100 : 0;
                if (marginPercent < minMargin) {
                    hasLowMargin = true;
                }
                subtotal += lineTotal;
                totalEstimatedCost += item.qty * estimatedCost;
                const quotationItem = queryRunner.manager.create(entities_1.QuotationItemEntity, {
                    quotationId: savedQuotation.id,
                    lineNo: i + 1,
                    sourceType: item.sourceType || 'MASTER',
                    productId: item.sourceType === 'MASTER' ? item.productId : null,
                    tempProductId: tempProductId || item.tempProductId,
                    itemCode: itemCode || item.itemCode,
                    itemName: itemName || item.itemName,
                    itemDescription: item.itemDescription,
                    brand: item.brand,
                    qty: item.qty,
                    unit: item.unit || 'ea',
                    unitPrice: item.unitPrice,
                    estimatedCost: estimatedCost,
                    discountPercent: item.discountPercent || 0,
                    discountAmount: item.discountAmount || 0,
                    netPrice: netPrice,
                    lineTotal: lineTotal,
                    marginAmount: marginAmount,
                    marginPercent: marginPercent,
                    qtyQuoted: item.qty,
                    qtyRemaining: item.qty,
                    itemStatus: 'PENDING',
                    publicNote: item.publicNote,
                    internalNote: item.internalNote,
                });
                await queryRunner.manager.save(quotationItem);
            }
            const discountAmount = dto.discountAmount || (subtotal * (dto.discountPercent || 0) / 100);
            const afterDiscount = subtotal - discountAmount;
            const taxAmount = afterDiscount * 0.07;
            const grandTotal = afterDiscount + taxAmount;
            const expectedMarginPercent = subtotal > 0 ? ((subtotal - totalEstimatedCost) / subtotal) * 100 : 0;
            savedQuotation.subtotal = subtotal;
            savedQuotation.discountPercent = dto.discountPercent || 0;
            savedQuotation.discountAmount = discountAmount;
            savedQuotation.afterDiscount = afterDiscount;
            savedQuotation.taxAmount = taxAmount;
            savedQuotation.grandTotal = grandTotal;
            savedQuotation.totalEstimatedCost = totalEstimatedCost;
            savedQuotation.expectedMarginPercent = expectedMarginPercent;
            savedQuotation.totalItems = dto.items.length;
            savedQuotation.requiresMarginApproval = hasLowMargin;
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
    async update(id, dto, userId) {
        const quotation = await this.findOne(id);
        if (quotation.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only draft quotations can be updated');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            Object.assign(quotation, {
                qtType: dto.qtType ?? quotation.qtType,
                docDate: dto.docDate ?? quotation.docDate,
                validUntil: dto.validUntil ?? quotation.validUntil,
                priceValidityDays: dto.priceValidityDays ?? quotation.priceValidityDays,
                deliveryDays: dto.deliveryDays ?? quotation.deliveryDays,
                creditTermDays: dto.creditTermDays ?? quotation.creditTermDays,
                customerId: dto.customerId ?? quotation.customerId,
                customerName: dto.customerName ?? quotation.customerName,
                customerAddress: dto.customerAddress ?? quotation.customerAddress,
                contactPerson: dto.contactPerson ?? quotation.contactPerson,
                salesPersonId: dto.salesPersonId ?? quotation.salesPersonId,
                salesPersonName: dto.salesPersonName ?? quotation.salesPersonName,
                paymentTermsText: dto.paymentTermsText ?? quotation.paymentTermsText,
                deliveryTerms: dto.deliveryTerms ?? quotation.deliveryTerms,
                publicNote: dto.publicNote ?? quotation.publicNote,
                internalNote: dto.internalNote ?? quotation.internalNote,
                remark: dto.remark ?? quotation.remark,
                updatedBy: userId,
            });
            if (dto.items) {
                await queryRunner.manager.delete(entities_1.QuotationItemEntity, { quotationId: id });
                const minMargin = await this.settingsService.getMinMarginPercent();
                let subtotal = 0;
                let totalEstimatedCost = 0;
                let hasLowMargin = false;
                for (let i = 0; i < dto.items.length; i++) {
                    const item = dto.items[i];
                    let tempProductId = item.tempProductId;
                    let itemCode = item.itemCode;
                    if (item.sourceType === 'TEMP' && !item.tempProductId) {
                        const tempProduct = await this.tempProductService.create({
                            name: item.itemName,
                            brand: item.brand,
                            unit: item.unit,
                            estimatedCost: item.estimatedCost || 0,
                            quotedPrice: item.unitPrice,
                            sourceQuotationId: id,
                            internalNote: item.internalNote,
                        }, userId);
                        tempProductId = tempProduct.id;
                        itemCode = tempProduct.tempCode;
                    }
                    const netPrice = item.unitPrice - (item.discountAmount || 0);
                    const lineTotal = item.qty * netPrice;
                    const estimatedCost = item.estimatedCost || 0;
                    const marginAmount = netPrice - estimatedCost;
                    const marginPercent = netPrice > 0 ? (marginAmount / netPrice) * 100 : 0;
                    if (marginPercent < minMargin)
                        hasLowMargin = true;
                    subtotal += lineTotal;
                    totalEstimatedCost += item.qty * estimatedCost;
                    const quotationItem = queryRunner.manager.create(entities_1.QuotationItemEntity, {
                        quotationId: id,
                        lineNo: i + 1,
                        sourceType: item.sourceType || 'MASTER',
                        productId: item.sourceType === 'MASTER' ? item.productId : null,
                        tempProductId: tempProductId,
                        itemCode: itemCode || item.itemCode,
                        itemName: item.itemName,
                        itemDescription: item.itemDescription,
                        brand: item.brand,
                        qty: item.qty,
                        unit: item.unit || 'ea',
                        unitPrice: item.unitPrice,
                        estimatedCost: estimatedCost,
                        discountPercent: item.discountPercent || 0,
                        discountAmount: item.discountAmount || 0,
                        netPrice: netPrice,
                        lineTotal: lineTotal,
                        marginAmount: marginAmount,
                        marginPercent: marginPercent,
                        qtyQuoted: item.qty,
                        qtyRemaining: item.qty,
                        itemStatus: 'PENDING',
                        publicNote: item.publicNote,
                        internalNote: item.internalNote,
                    });
                    await queryRunner.manager.save(quotationItem);
                }
                const discountAmount = dto.discountAmount || (subtotal * (dto.discountPercent || 0) / 100);
                const afterDiscount = subtotal - discountAmount;
                const taxAmount = afterDiscount * 0.07;
                const grandTotal = afterDiscount + taxAmount;
                const expectedMarginPercent = subtotal > 0 ? ((subtotal - totalEstimatedCost) / subtotal) * 100 : 0;
                quotation.subtotal = subtotal;
                quotation.discountPercent = dto.discountPercent || 0;
                quotation.discountAmount = discountAmount;
                quotation.afterDiscount = afterDiscount;
                quotation.taxAmount = taxAmount;
                quotation.grandTotal = grandTotal;
                quotation.totalEstimatedCost = totalEstimatedCost;
                quotation.expectedMarginPercent = expectedMarginPercent;
                quotation.totalItems = dto.items.length;
                quotation.requiresMarginApproval = hasLowMargin;
            }
            await queryRunner.manager.save(quotation);
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
    async submitForApproval(id, userId) {
        const quotation = await this.findOne(id);
        if (quotation.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only draft quotations can be submitted for approval');
        }
        quotation.status = 'PENDING_APPROVAL';
        quotation.updatedBy = userId;
        return this.quotationRepository.save(quotation);
    }
    async approve(id, userId, note) {
        const quotation = await this.findOne(id);
        if (quotation.status !== 'PENDING_APPROVAL') {
            throw new common_1.BadRequestException('Quotation is not pending approval');
        }
        quotation.status = 'APPROVED';
        quotation.approvedBy = userId;
        quotation.approvedAt = new Date();
        quotation.approvalNote = note;
        quotation.updatedBy = userId;
        return this.quotationRepository.save(quotation);
    }
    async approveMargin(id, userId, note) {
        const quotation = await this.findOne(id);
        if (!quotation.requiresMarginApproval) {
            throw new common_1.BadRequestException('Quotation does not require margin approval');
        }
        quotation.marginApprovedBy = userId;
        quotation.marginApprovedAt = new Date();
        quotation.marginApprovalNote = note;
        quotation.updatedBy = userId;
        return this.quotationRepository.save(quotation);
    }
    async send(id, userId) {
        const quotation = await this.findOne(id);
        if (quotation.status !== 'APPROVED') {
            throw new common_1.BadRequestException('Only approved quotations can be sent');
        }
        quotation.status = 'SENT';
        quotation.updatedBy = userId;
        return this.quotationRepository.save(quotation);
    }
    async confirm(id, userId) {
        const quotation = await this.findOne(id);
        if (!['DRAFT', 'APPROVED', 'SENT'].includes(quotation.status)) {
            throw new common_1.BadRequestException('Quotation cannot be confirmed');
        }
        quotation.status = 'APPROVED';
        quotation.confirmedAt = new Date();
        quotation.confirmedBy = userId;
        quotation.updatedBy = userId;
        return this.quotationRepository.save(quotation);
    }
    async cancel(id, userId, reason) {
        const quotation = await this.findOne(id);
        if (quotation.status === 'CANCELLED' || quotation.status === 'CLOSED') {
            throw new common_1.BadRequestException('Quotation cannot be cancelled');
        }
        quotation.status = 'CANCELLED';
        quotation.cancelledAt = new Date();
        quotation.cancelledBy = userId;
        quotation.cancelReason = reason;
        quotation.updatedBy = userId;
        return this.quotationRepository.save(quotation);
    }
    async cancelItem(id, itemId, userId, reason) {
        const quotation = await this.findOne(id);
        const item = quotation.items.find(i => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        if (item.itemStatus === 'SOLD' || item.itemStatus === 'CANCELLED') {
            throw new common_1.BadRequestException('Item cannot be cancelled');
        }
        item.itemStatus = 'CANCELLED';
        item.qtyCancelled = item.qtyRemaining;
        item.qtyRemaining = 0;
        item.cancelReason = reason;
        item.cancelledBy = userId;
        item.cancelledAt = new Date();
        await this.itemRepository.save(item);
        await this.updateFulfillmentSummary(id);
        return this.findOne(id);
    }
    async updateFulfillmentSummary(id) {
        const quotation = await this.findOne(id);
        let itemsSold = 0;
        let itemsPartial = 0;
        let itemsCancelled = 0;
        for (const item of quotation.items) {
            if (item.itemStatus === 'SOLD')
                itemsSold++;
            else if (item.itemStatus === 'PARTIAL')
                itemsPartial++;
            else if (item.itemStatus === 'CANCELLED')
                itemsCancelled++;
        }
        const totalItems = quotation.items.length;
        const fulfillmentPercent = totalItems > 0
            ? ((itemsSold + itemsPartial * 0.5) / totalItems) * 100
            : 0;
        quotation.itemsSold = itemsSold;
        quotation.itemsPartial = itemsPartial;
        quotation.itemsCancelled = itemsCancelled;
        quotation.fulfillmentPercent = fulfillmentPercent;
        if (itemsSold + itemsCancelled === totalItems && itemsSold > 0) {
            quotation.status = 'CLOSED';
        }
        else if (itemsSold > 0 || itemsPartial > 0) {
            quotation.status = 'PARTIALLY_CLOSED';
        }
        await this.quotationRepository.save(quotation);
    }
    async getItemsForPO(id) {
        const quotation = await this.findOne(id);
        const needToOrder = quotation.items.filter(i => i.itemStatus === 'PENDING' && i.qtyRemaining > 0);
        return {
            quotation: {
                id: quotation.id,
                docFullNo: quotation.docFullNo,
                customerName: quotation.customerName,
            },
            needToOrder,
            tempProducts: needToOrder.filter(i => i.sourceType === 'TEMP'),
            masterProducts: needToOrder.filter(i => i.sourceType === 'MASTER'),
        };
    }
    async getItemsForInvoice(id) {
        const quotation = await this.findOne(id);
        const varianceThreshold = await this.settingsService.getVarianceAlertPercent();
        const ready = [];
        const withVariance = [];
        const notReady = [];
        for (const item of quotation.items) {
            if (item.itemStatus === 'CANCELLED')
                continue;
            if (item.qtyReceived > 0 && item.qtyRemaining > 0) {
                if (item.costVariancePercent && Math.abs(item.costVariancePercent) > varianceThreshold) {
                    withVariance.push(item);
                }
                else {
                    ready.push(item);
                }
            }
            else if (item.qtyRemaining > 0) {
                notReady.push(item);
            }
        }
        return { ready, withVariance, notReady };
    }
    async delete(id, userId) {
        const quotation = await this.findOne(id);
        if (!['CANCELLED', 'DRAFT'].includes(quotation.status)) {
            throw new common_1.BadRequestException('ไม่สามารถลบใบเสนอราคาที่ยังไม่ได้ยกเลิกหรือไม่ใช่ฉบับร่าง');
        }
        await this.itemRepository.delete({ quotation: { id } });
        await this.quotationRepository.delete(id);
        return { success: true, message: 'ลบใบเสนอราคาสำเร็จ' };
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
        temp_product_service_1.TempProductService,
        system_settings_service_1.SystemSettingsService,
        typeorm_2.DataSource])
], QuotationService);
//# sourceMappingURL=quotation.service.js.map