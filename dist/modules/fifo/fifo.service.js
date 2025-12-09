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
exports.FifoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
let FifoService = class FifoService {
    constructor(layerRepository, transactionRepository, balanceRepository) {
        this.layerRepository = layerRepository;
        this.transactionRepository = transactionRepository;
        this.balanceRepository = balanceRepository;
    }
    async createLayer(params, queryRunner) {
        const repo = queryRunner ? queryRunner.manager.getRepository(entities_1.FifoLayerEntity) : this.layerRepository;
        const txRepo = queryRunner ? queryRunner.manager.getRepository(entities_1.FifoTransactionEntity) : this.transactionRepository;
        const layer = repo.create({
            productId: params.productId,
            warehouseId: params.warehouseId,
            qtyOriginal: params.qty,
            qtyRemaining: params.qty,
            unitCost: params.unitCost,
            referenceType: params.referenceType,
            referenceId: params.referenceId,
            referenceItemId: params.referenceItemId,
            receivedAt: new Date(),
        });
        const savedLayer = await repo.save(layer);
        const tx = txRepo.create({
            fifoLayerId: savedLayer.id,
            qty: params.qty,
            unitCost: params.unitCost,
            totalCost: params.qty * params.unitCost,
            transactionType: 'IN',
            referenceType: params.referenceType,
            referenceId: params.referenceId,
            referenceItemId: params.referenceItemId,
        });
        await txRepo.save(tx);
        await this.updateBalance(params.productId, params.warehouseId, params.qty, 'receive', queryRunner);
        return savedLayer;
    }
    async deductFifo(productId, warehouseId, qty, refType, refId, refItemId, queryRunner) {
        const repo = queryRunner ? queryRunner.manager.getRepository(entities_1.FifoLayerEntity) : this.layerRepository;
        const txRepo = queryRunner ? queryRunner.manager.getRepository(entities_1.FifoTransactionEntity) : this.transactionRepository;
        const layers = await repo.find({
            where: { productId, warehouseId, qtyRemaining: (0, typeorm_2.MoreThan)(0) },
            order: { receivedAt: 'ASC', id: 'ASC' },
        });
        let remaining = qty;
        let totalCost = 0;
        const details = [];
        for (const layer of layers) {
            if (remaining <= 0)
                break;
            const deduct = Math.min(Number(layer.qtyRemaining), remaining);
            const cost = deduct * Number(layer.unitCost);
            layer.qtyRemaining = Number(layer.qtyRemaining) - deduct;
            await repo.save(layer);
            const tx = txRepo.create({
                fifoLayerId: layer.id,
                qty: deduct,
                unitCost: layer.unitCost,
                totalCost: cost,
                transactionType: 'OUT',
                referenceType: refType,
                referenceId: refId,
                referenceItemId: refItemId,
            });
            await txRepo.save(tx);
            details.push({ layerId: layer.id, qty: deduct, unitCost: Number(layer.unitCost), cost });
            totalCost += cost;
            remaining -= deduct;
        }
        if (remaining > 0) {
            throw new common_1.BadRequestException(`Insufficient stock. Short by ${remaining} units`);
        }
        await this.updateBalance(productId, warehouseId, -qty, 'issue', queryRunner);
        return { totalCost, details };
    }
    async updateBalance(productId, warehouseId, qtyChange, type, queryRunner) {
        const repo = queryRunner ? queryRunner.manager.getRepository(entities_1.StockBalanceEntity) : this.balanceRepository;
        let balance = await repo.findOne({ where: { productId, warehouseId } });
        if (!balance) {
            balance = repo.create({ productId, warehouseId, qtyOnHand: 0, qtyReserved: 0 });
        }
        balance.qtyOnHand = Number(balance.qtyOnHand) + qtyChange;
        if (type === 'receive') {
            balance.lastReceivedAt = new Date();
        }
        else {
            balance.lastIssuedAt = new Date();
        }
        await repo.save(balance);
    }
    async getStockBalance(productId, warehouseId) {
        const where = {};
        if (productId)
            where.productId = productId;
        if (warehouseId)
            where.warehouseId = warehouseId;
        return this.balanceRepository.find({ where });
    }
    async getFifoLayers(productId, warehouseId) {
        const where = { productId, qtyRemaining: (0, typeorm_2.MoreThan)(0) };
        if (warehouseId)
            where.warehouseId = warehouseId;
        return this.layerRepository.find({ where, order: { receivedAt: 'ASC' } });
    }
};
exports.FifoService = FifoService;
exports.FifoService = FifoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.FifoLayerEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.FifoTransactionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.StockBalanceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FifoService);
//# sourceMappingURL=fifo.service.js.map