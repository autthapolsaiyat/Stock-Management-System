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
exports.StockTransferService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const doc_numbering_service_1 = require("../doc-numbering/doc-numbering.service");
const fifo_service_1 = require("../fifo/fifo.service");
let StockTransferService = class StockTransferService {
    constructor(transferRepository, itemRepository, docNumberingService, fifoService, dataSource) {
        this.transferRepository = transferRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.fifoService = fifoService;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        return this.transferRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
    }
    async findOne(id) {
        const transfer = await this.transferRepository.findOne({ where: { id }, relations: ['items'] });
        if (!transfer)
            throw new common_1.NotFoundException('Stock Transfer not found');
        return transfer;
    }
    async create(dto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('TR', queryRunner);
            const transfer = queryRunner.manager.create(entities_1.StockTransferEntity, {
                docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
                docDate: dto.docDate || new Date(),
                fromWarehouseId: dto.fromWarehouseId,
                toWarehouseId: dto.toWarehouseId,
                reason: dto.reason,
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedTransfer = await queryRunner.manager.save(transfer);
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                const transferItem = queryRunner.manager.create(entities_1.StockTransferItemEntity, {
                    stockTransferId: savedTransfer.id,
                    lineNo: i + 1,
                    productId: item.productId,
                    qty: item.qty,
                });
                await queryRunner.manager.save(transferItem);
            }
            await queryRunner.commitTransaction();
            return this.findOne(savedTransfer.id);
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
        const transfer = await this.findOne(id);
        if (transfer.status !== 'DRAFT')
            throw new common_1.BadRequestException('Only draft can be posted');
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalAmount = 0;
            for (const item of transfer.items) {
                const result = await this.fifoService.deductFifo(item.productId, transfer.fromWarehouseId, Number(item.qty), 'TRANSFER', transfer.id, item.id, queryRunner);
                await this.fifoService.createLayer({
                    productId: item.productId,
                    warehouseId: transfer.toWarehouseId,
                    qty: Number(item.qty),
                    unitCost: result.totalCost / Number(item.qty),
                    referenceType: 'TRANSFER',
                    referenceId: transfer.id,
                    referenceItemId: item.id,
                }, queryRunner);
                item.unitCost = result.totalCost / Number(item.qty);
                item.lineTotal = result.totalCost;
                totalAmount += result.totalCost;
                await queryRunner.manager.save(item);
            }
            transfer.totalAmount = totalAmount;
            transfer.status = 'POSTED';
            transfer.postedAt = new Date();
            transfer.postedBy = userId;
            await queryRunner.manager.save(transfer);
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
};
exports.StockTransferService = StockTransferService;
exports.StockTransferService = StockTransferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.StockTransferEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StockTransferItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        doc_numbering_service_1.DocNumberingService,
        fifo_service_1.FifoService,
        typeorm_2.DataSource])
], StockTransferService);
//# sourceMappingURL=stock-transfer.service.js.map