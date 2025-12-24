import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockIssueEntity, StockIssueItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';

@Injectable()
export class StockIssueService {
  constructor(
    @InjectRepository(StockIssueEntity)
    private issueRepository: Repository<StockIssueEntity>,
    @InjectRepository(StockIssueItemEntity)
    private itemRepository: Repository<StockIssueItemEntity>,
    private docNumberingService: DocNumberingService,
    private fifoService: FifoService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    return this.issueRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
  }

  async findOne(id: number) {
    const issue = await this.issueRepository.findOne({ where: { id }, relations: ['items'] });
    if (!issue) throw new NotFoundException('Stock Issue not found');
    return issue;
  }

  async create(dto: any, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('IS', queryRunner);
      
      const issue = queryRunner.manager.create(StockIssueEntity, {
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
        const issueItem = queryRunner.manager.create(StockIssueItemEntity, {
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: number, userId: number) {
    const issue = await this.findOne(id);
    if (issue.status !== 'DRAFT') throw new BadRequestException('Only draft can be posted');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      let totalAmount = 0;
      for (const item of issue.items) {
        const result = await this.fifoService.deductFifo(
          item.productId, issue.warehouseId, Number(item.qty),
          'ISSUE', issue.id, item.id, queryRunner
        );
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(id: number, userId: number) {
    const issue = await this.findOne(id);
    if (issue.status !== 'POSTED') throw new BadRequestException('Only posted issues can be cancelled');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Reverse FIFO - add stock back
      for (const item of issue.items) {
        await this.fifoService.createLayer({
          productId: item.productId,
          warehouseId: issue.warehouseId,
          qty: Number(item.qty),
          unitCost: Number(item.unitCost),
          referenceType: 'ISSUE_CANCEL',
          referenceId: issue.id,
          referenceItemId: item.id,
        }, queryRunner);
      }
      
      issue.status = 'CANCELLED';
      issue.cancelledAt = new Date();
      issue.cancelledBy = userId;
      await queryRunner.manager.save(issue);
      
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async delete(id: number) {
    const issue = await this.findOne(id);
    if (!['DRAFT', 'CANCELLED'].includes(issue.status)) {
      throw new BadRequestException('Only DRAFT or CANCELLED issues can be deleted');
    }
    
    await this.itemRepository.delete({ stockIssueId: id });
    await this.issueRepository.delete(id);
    return { message: 'Deleted successfully' };
  }
}
