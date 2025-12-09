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
let PurchaseOrderService = class PurchaseOrderService {
    constructor(poRepository, itemRepository, docNumberingService, dataSource) {
        this.poRepository = poRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        return this.poRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
    }
    async findOne(id) {
        const po = await this.poRepository.findOne({ where: { id }, relations: ['items'] });
        if (!po)
            throw new common_1.NotFoundException('Purchase Order not found');
        return po;
    }
    async create(dto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('PO', queryRunner);
            const po = queryRunner.manager.create(entities_1.PurchaseOrderEntity, {
                docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
                docDate: dto.docDate || new Date(),
                supplierId: dto.supplierId,
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedPo = await queryRunner.manager.save(po);
            let subtotal = 0;
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                const lineTotal = item.qty * item.unitPrice - (item.discountAmount || 0);
                subtotal += lineTotal;
                const poItem = queryRunner.manager.create(entities_1.PurchaseOrderItemEntity, {
                    purchaseOrderId: savedPo.id,
                    lineNo: i + 1,
                    productId: item.productId,
                    qty: item.qty,
                    unitPrice: item.unitPrice,
                    discountAmount: item.discountAmount || 0,
                    lineTotal,
                    qtyReceived: 0,
                });
                await queryRunner.manager.save(poItem);
            }
            savedPo.subtotal = subtotal;
            savedPo.taxAmount = subtotal * 0.07;
            savedPo.grandTotal = subtotal * 1.07;
            await queryRunner.manager.save(savedPo);
            await queryRunner.commitTransaction();
            return this.findOne(savedPo.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async approve(id, userId) {
        const po = await this.findOne(id);
        if (po.status !== 'DRAFT')
            throw new common_1.BadRequestException('Only draft PO can be approved');
        po.status = 'APPROVED';
        po.approvedAt = new Date();
        po.approvedBy = userId;
        return this.poRepository.save(po);
    }
    async cancel(id, userId) {
        const po = await this.findOne(id);
        if (po.status === 'CANCELLED')
            throw new common_1.BadRequestException('Already cancelled');
        po.status = 'CANCELLED';
        po.cancelledAt = new Date();
        po.cancelledBy = userId;
        return this.poRepository.save(po);
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
        typeorm_2.DataSource])
], PurchaseOrderService);
//# sourceMappingURL=purchase-order.service.js.map