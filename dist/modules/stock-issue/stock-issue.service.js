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
exports.StockIssueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const doc_numbering_service_1 = require("../doc-numbering/doc-numbering.service");
const fifo_service_1 = require("../fifo/fifo.service");
let StockIssueService = class StockIssueService {
    constructor(issueRepository, itemRepository, docNumberingService, fifoService, dataSource) {
        this.issueRepository = issueRepository;
        this.itemRepository = itemRepository;
        this.docNumberingService = docNumberingService;
        this.fifoService = fifoService;
        this.dataSource = dataSource;
    }
    async findAll(status) {
        const where = { isLatestRevision: true };
        if (status)
            where.status = status;
        return this.issueRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
    }
    async findOne(id) {
        const issue = await this.issueRepository.findOne({ where: { id }, relations: ['items'] });
        if (!issue)
            throw new common_1.NotFoundException('Stock Issue not found');
        return issue;
    }
    async create(dto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('IS', queryRunner);
            const issue = queryRunner.manager.create(entities_1.StockIssueEntity, {
                docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
                docDate: dto.docDate || new Date(),
                warehouseId: dto.warehouseId,
                reason: dto.reason || 'General issue',
                status: 'DRAFT',
                createdBy: userId,
            });
            const savedIssue = await queryRunner.manager.save(issue);
            for (let i = 0; i < dto.items.length; i++) {
                const item = dto.items[i];
                const issueItem = queryRunner.manager.create(entities_1.StockIssueItemEntity, {
                    stockIssueId: savedIssue.id,
                    lineNo: i + 1,
                    productId: item.productId,
                    qty: item.qty,
                    unitCost: 0,
                    lineTotal: 0,
                });
                await queryRunner.manager.save(issueItem);
            }
            await queryRunner.commitTransaction();
            return this.findOne(savedIssue.id);
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
        const issue = await this.findOne(id);
        if (issue.status !== 'DRAFT')
            throw new common_1.BadRequestException('Only draft can be posted');
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalAmount = 0;
            for (const item of issue.items) {
                const result = await this.fifoService.deductFifo(item.productId, issue.warehouseId, Number(item.qty), 'ISSUE', issue.id, item.id, queryRunner);
                item.unitCost = result.totalCost / Number(item.qty);
                item.lineTotal = result.totalCost;
                totalAmount += result.totalCost;
                await queryRunner.manager.save(item);
            }
            issue.totalAmount = totalAmount;
            issue.status = 'POSTED';
            issue.postedAt = new Date();
            issue.postedBy = userId;
            await queryRunner.manager.save(issue);
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
exports.StockIssueService = StockIssueService;
exports.StockIssueService = StockIssueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.StockIssueEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StockIssueItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        doc_numbering_service_1.DocNumberingService,
        fifo_service_1.FifoService,
        typeorm_2.DataSource])
], StockIssueService);
//# sourceMappingURL=stock-issue.service.js.map