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
exports.PurchaseOrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const doc_numbering_service_1 = require("../doc-numbering/doc-numbering.service");
const quotation_service_1 = require("../quotation/quotation.service");
let PurchaseOrderService = class PurchaseOrderService {
    constructor(poRepository, itemRepository, docNumberingService, quotationService, dataSource) {
        this.poRepository = poRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.quotationService = quotationService;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        return this.poRepository.find({
            where,
            order: { createdAt: 'DESC' },
            relations: ['items']
        });
    }
    async findOne(id) {
        const po = await this.poRepository.findOne({
            where: { id },
            relations: ['items']
        });
        if (!po)
            throw new common_1.NotFoundException('Purchase order not found');
        return po;
    }
    async findByQuotation(quotationId) {
        return this.poRepository.find({
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
            const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('PO', queryRunner);
            const po = queryRunner.manager.create(entities_1.PurchaseOrderEntity, {
                docBaseNo,
                docFullNo,
                docRevision: 1,
                isLatestRevision: true,
                quotationId: dto.quotationId,
                quotationDocNo: dto.quotationDocNo,
                supplierId: dto.supplierId,
                supplierName: dto.supplierName,
                supplierAddress: dto.supplierAddress,
                contactPerson: dto.contactPerson,
                docDate: dto.docDate || new Date(),
                deliveryDate: dto.deliveryDate,
                expectedDeliveryDate: dto.expectedDeliveryDate,
                paymentTermDays: dto.paymentTermDays || 30,
                paymentTermsText: dto.paymentTermsText,
                deliveryTerms: dto.deliveryTerms,
                publicNote: dto.publicNote,
                internalNote: dto.internalNote,
                remark: dto.remark,
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedPO = await queryRunner.manager.save(po);
            let subtotal = 0;
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                const netPrice = item.unitPrice - (item.discountAmount || 0);
                const lineTotal = item.qty * netPrice;
                subtotal += lineTotal;
                const poItem = queryRunner.manager.create(entities_1.PurchaseOrderItemEntity, {
                    purchaseOrderId: savedPO.id,
                    lineNo: i + 1,
                    quotationId: item.quotationId || dto.quotationId,
                    quotationItemId: item.quotationItemId,
                    sourceType: item.sourceType || 'MASTER',
                    productId: item.sourceType === 'MASTER' ? item.productId : null,
                    tempProductId: item.sourceType === 'TEMP' ? item.tempProductId : null,
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
                    qtyOrdered: item.qty,
                    qtyRemaining: item.qty,
                    itemStatus: 'PENDING',
                    internalNote: item.internalNote,
                    supplierNote: item.supplierNote,
                });
                await queryRunner.manager.save(poItem);
                if (item.quotationItemId) {
                    await queryRunner.manager.update('quotation_items', item.quotationItemId, {
                        qtyOrdered: () => `qty_ordered + ${item.qty}`,
                        itemStatus: 'ORDERED',
                        poItemId: poItem.id,
                    });
                }
            }
            const discountTotal = dto.discountTotal || (subtotal * (dto.discountPercent || 0) / 100);
            const afterDiscount = subtotal - discountTotal;
            const taxAmount = afterDiscount * (dto.taxRate || 7) / 100;
            const grandTotal = afterDiscount + taxAmount;
            savedPO.subtotal = subtotal;
            savedPO.discountPercent = dto.discountPercent || 0;
            savedPO.discountTotal = discountTotal;
            savedPO.afterDiscount = afterDiscount;
            savedPO.taxRate = dto.taxRate || 7;
            savedPO.taxAmount = taxAmount;
            savedPO.grandTotal = grandTotal;
            savedPO.totalItems = dto.items.length;
            await queryRunner.manager.save(savedPO);
            await queryRunner.commitTransaction();
            return this.findOne(savedPO.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createFromQuotation(quotationId, supplierId, dto, userId) {
        const quotation = await this.quotationService.findOne(quotationId);
        if (!['APPROVED', 'SENT', 'CONFIRMED', 'PARTIALLY_CLOSED'].includes(quotation.status)) {
            throw new common_1.BadRequestException('Quotation must be approved before creating PO');
        }
        const supplierResult = await this.dataSource.query(`
      SELECT name, address, phone, email, payment_term_days 
      FROM suppliers WHERE id = $1
    `, [supplierId]);
        const supplier = supplierResult[0] || {};
        const itemsToOrder = quotation.items.filter(item => item.itemStatus !== 'CANCELLED' &&
            item.qtyRemaining > 0 &&
            (!dto.itemIds || dto.itemIds.includes(item.id)));
        if (itemsToOrder.length === 0) {
            throw new common_1.BadRequestException('No items available for ordering');
        }
        const poDto = {
            quotationId: quotation.id,
            quotationDocNo: quotation.docFullNo,
            supplierId: supplierId,
            supplierName: dto.supplierName || supplier.name,
            supplierAddress: dto.supplierAddress || supplier.address,
            supplierPhone: dto.supplierPhone || supplier.phone,
            supplierEmail: dto.supplierEmail || supplier.email,
            contactPerson: dto.contactPerson,
            docDate: dto.docDate || new Date(),
            deliveryDate: dto.deliveryDate,
            expectedDeliveryDate: dto.expectedDeliveryDate || new Date(Date.now() + quotation.deliveryDays * 24 * 60 * 60 * 1000),
            paymentTermDays: dto.paymentTermDays || supplier.payment_term_days || quotation.creditTermDays,
            paymentTermsText: dto.paymentTermsText,
            deliveryTerms: dto.deliveryTerms,
            publicNote: dto.publicNote,
            internalNote: dto.internalNote,
            remark: dto.remark,
            items: itemsToOrder.map(item => ({
                quotationId: quotation.id,
                quotationItemId: item.id,
                sourceType: item.sourceType,
                productId: item.productId,
                tempProductId: item.tempProductId,
                itemCode: item.itemCode,
                itemName: item.itemName,
                itemDescription: item.itemDescription,
                brand: item.brand,
                qty: dto.quantities?.[item.id] || item.qtyRemaining,
                unit: item.unit,
                unitPrice: item.estimatedCost > 0 ? item.estimatedCost : item.unitPrice,
                internalNote: item.internalNote,
            })),
        };
        return this.create(poDto, userId);
    }
    async update(id, dto, userId) {
        const po = await this.findOne(id);
        if (po.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only draft POs can be updated');
        }
        Object.assign(po, {
            supplierId: dto.supplierId ?? po.supplierId,
            supplierName: dto.supplierName ?? po.supplierName,
            supplierAddress: dto.supplierAddress ?? po.supplierAddress,
            contactPerson: dto.contactPerson ?? po.contactPerson,
            docDate: dto.docDate ?? po.docDate,
            deliveryDate: dto.deliveryDate ?? po.deliveryDate,
            expectedDeliveryDate: dto.expectedDeliveryDate ?? po.expectedDeliveryDate,
            paymentTermDays: dto.paymentTermDays ?? po.paymentTermDays,
            paymentTermsText: dto.paymentTermsText ?? po.paymentTermsText,
            deliveryTerms: dto.deliveryTerms ?? po.deliveryTerms,
            publicNote: dto.publicNote ?? po.publicNote,
            internalNote: dto.internalNote ?? po.internalNote,
            remark: dto.remark ?? po.remark,
            updatedBy: userId,
        });
        return this.poRepository.save(po);
    }
    async submitForApproval(id, userId) {
        const po = await this.findOne(id);
        if (po.status !== 'DRAFT') {
            throw new common_1.BadRequestException('Only draft POs can be submitted');
        }
        po.status = 'PENDING_APPROVAL';
        po.updatedBy = userId;
        return this.poRepository.save(po);
    }
    async approve(id, userId, note) {
        const po = await this.findOne(id);
        if (!['DRAFT', 'PENDING_APPROVAL'].includes(po.status)) {
            throw new common_1.BadRequestException('PO is not pending approval');
        }
        po.status = 'APPROVED';
        po.approvedBy = userId;
        po.approvedAt = new Date();
        po.approvalNote = note;
        po.updatedBy = userId;
        return this.poRepository.save(po);
    }
    async send(id, userId) {
        const po = await this.findOne(id);
        if (po.status !== 'APPROVED') {
            throw new common_1.BadRequestException('Only approved POs can be sent');
        }
        po.status = 'SENT';
        po.updatedBy = userId;
        return this.poRepository.save(po);
    }
    async cancel(id, userId, reason) {
        const po = await this.findOne(id);
        if (['RECEIVED', 'CANCELLED'].includes(po.status)) {
            throw new common_1.BadRequestException('PO cannot be cancelled');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of po.items) {
                if (item.quotationItemId) {
                    await queryRunner.manager.update('quotation_items', item.quotationItemId, {
                        qtyOrdered: () => `GREATEST(0, qty_ordered - ${item.qtyOrdered})`,
                        itemStatus: 'PENDING',
                    });
                }
            }
            po.status = 'CANCELLED';
            po.cancelledAt = new Date();
            po.cancelledBy = userId;
            po.cancelReason = reason;
            po.updatedBy = userId;
            await queryRunner.manager.save(po);
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
    async updateReceiveStatus(id) {
        const po = await this.findOne(id);
        let itemsReceived = 0;
        let itemsPartial = 0;
        for (const item of po.items) {
            if (item.qtyReceived >= item.qtyOrdered) {
                itemsReceived++;
            }
            else if (item.qtyReceived > 0) {
                itemsPartial++;
            }
        }
        const totalItems = po.items.length;
        const receivePercent = totalItems > 0
            ? ((itemsReceived + itemsPartial * 0.5) / totalItems) * 100
            : 0;
        po.itemsReceived = itemsReceived;
        po.itemsPartial = itemsPartial;
        po.receivePercent = receivePercent;
        if (itemsReceived === totalItems) {
            po.status = 'RECEIVED';
        }
        else if (itemsReceived > 0 || itemsPartial > 0) {
            po.status = 'PARTIAL_RECEIVED';
        }
        await this.poRepository.save(po);
    }
    async getItemsForGR(id) {
        const po = await this.findOne(id);
        if (!['APPROVED', 'SENT', 'PARTIAL_RECEIVED'].includes(po.status)) {
            throw new common_1.BadRequestException('PO must be approved before receiving');
        }
        const pendingItems = po.items.filter(item => item.itemStatus !== 'RECEIVED' && item.qtyRemaining > 0);
        return {
            purchaseOrder: {
                id: po.id,
                docFullNo: po.docFullNo,
                supplierId: po.supplierId,
                supplierName: po.supplierName,
                quotationId: po.quotationId,
                quotationDocNo: po.quotationDocNo,
            },
            pendingItems,
            summary: {
                totalItems: po.items.length,
                received: po.itemsReceived,
                partial: po.itemsPartial,
                pending: pendingItems.length,
            },
        };
    }
};
exports.PurchaseOrderService = PurchaseOrderService;
exports.PurchaseOrderService = PurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.PurchaseOrderEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.PurchaseOrderItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        doc_numbering_service_1.DocNumberingService,
        quotation_service_1.QuotationService,
        typeorm_2.DataSource])
], PurchaseOrderService);
//# sourceMappingURL=purchase-order.service.js.map