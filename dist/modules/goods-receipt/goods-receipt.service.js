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
exports.GoodsReceiptService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const doc_numbering_service_1 = require("../doc-numbering/doc-numbering.service");
const fifo_service_1 = require("../fifo/fifo.service");
let GoodsReceiptService = class GoodsReceiptService {
    constructor(grnRepository, itemRepository, docNumberingService, fifoService, dataSource) {
        this.grnRepository = grnRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.fifoService = fifoService;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        return this.grnRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
    }
    async findOne(id) {
        const grn = await this.grnRepository.findOne({ where: { id }, relations: ['items'] });
        if (!grn)
            throw new common_1.NotFoundException('GRN not found');
        return grn;
    }
    async create(dto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('GR', queryRunner);
            const grn = queryRunner.manager.create(entities_1.GoodsReceiptEntity, {
                docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
                docDate: dto.docDate || new Date(),
                supplierId: dto.supplierId,
                warehouseId: dto.warehouseId,
                purchaseOrderId: dto.purchaseOrderId,
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedGrn = await queryRunner.manager.save(grn);
            let totalAmount = 0;
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                const lineTotal = item.qty * item.unitCost;
                totalAmount += lineTotal;
                const grnItem = queryRunner.manager.create(entities_1.GoodsReceiptItemEntity, {
                    goodsReceiptId: savedGrn.id,
                    lineNo: i + 1,
                    productId: item.productId,
                    qty: item.qty,
                    unitCost: item.unitCost,
                    lineTotal,
                });
                await queryRunner.manager.save(grnItem);
            }
            savedGrn.totalAmount = totalAmount;
            await queryRunner.manager.save(savedGrn);
            await queryRunner.commitTransaction();
            return this.findOne(savedGrn.id);
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
        const grn = await this.findOne(id);
        if (grn.status !== 'DRAFT')
            throw new common_1.BadRequestException('Only draft GRN can be posted');
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of grn.items) {
                await this.fifoService.createLayer({
                    productId: item.productId,
                    warehouseId: grn.warehouseId,
                    qty: Number(item.qty),
                    unitCost: Number(item.unitCost),
                    referenceType: 'GRN',
                    referenceId: grn.id,
                    referenceItemId: item.id,
                }, queryRunner);
            }
            grn.status = 'POSTED';
            grn.postedAt = new Date();
            grn.postedBy = userId;
            await queryRunner.manager.save(grn);
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
        const grn = await this.findOne(id);
        if (grn.status === 'POSTED')
            throw new common_1.BadRequestException('Posted GRN cannot be cancelled');
        grn.status = 'CANCELLED';
        grn.cancelledAt = new Date();
        grn.cancelledBy = userId;
        return this.grnRepository.save(grn);
    }
};
exports.GoodsReceiptService = GoodsReceiptService;
exports.GoodsReceiptService = GoodsReceiptService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.GoodsReceiptEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.GoodsReceiptItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        doc_numbering_service_1.DocNumberingService,
        fifo_service_1.FifoService,
        typeorm_2.DataSource])
], GoodsReceiptService);
//# sourceMappingURL=goods-receipt.service.js.map