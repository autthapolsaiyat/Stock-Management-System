import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockIssueEntity, StockIssueItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
import { AuditLogService } from '../audit-log/audit-log.service';

// Interface สำหรับ Request info (ใช้ร่วมกันทุก module)
export interface AuditContext {
  userId: number;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class StockIssueService {
  constructor(
    @InjectRepository(StockIssueEntity)
    private issueRepository: Repository<StockIssueEntity>,
    @InjectRepository(StockIssueItemEntity)
    private itemRepository: Repository<StockIssueItemEntity>,
    private docNumberingService: DocNumberingService,
    private fifoService: FifoService,
    private auditLogService: AuditLogService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string, ctx?: AuditContext) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    const result = await this.issueRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
    
    // Log VIEW action
    if (ctx) {
      await this.auditLogService.log({
        module: 'STOCK_ISSUE',
        action: 'VIEW',
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { filter: { status }, count: result.length },
      });
    }
    
    return result;
  }

  async findOne(id: number, ctx?: AuditContext) {
    const issue = await this.issueRepository.findOne({ where: { id }, relations: ['items'] });
    if (!issue) throw new NotFoundException('Stock Issue not found');
    
    // Log VIEW action (detail)
    if (ctx) {
      await this.auditLogService.log({
        module: 'STOCK_ISSUE',
        action: 'VIEW',
        documentId: issue.id,
        documentNo: issue.docFullNo,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
      });
    }
    
    return issue;
  }

  async create(dto: any, ctx: AuditContext) {
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
        createdBy: ctx.userId,
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
      
      // Log CREATE action
      await this.auditLogService.log({
        module: 'STOCK_ISSUE',
        action: 'CREATE',
        documentId: savedIssue.id,
        documentNo: docFullNo,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { 
          warehouseId: dto.warehouseId, 
          reason: dto.reason,
          itemCount: dto.items.length,
        },
      });
      
      return this.findOne(savedIssue.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: number, ctx: AuditContext) {
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
      issue.postedBy = ctx.userId;
      await queryRunner.manager.save(issue);
      
      await queryRunner.commitTransaction();
      
      // Log POST action
      await this.auditLogService.log({
        module: 'STOCK_ISSUE',
        action: 'POST',
        documentId: issue.id,
        documentNo: issue.docFullNo,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { totalAmount, itemCount: issue.items.length },
      });
      
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(id: number, ctx: AuditContext) {
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
      issue.cancelledBy = ctx.userId;
      await queryRunner.manager.save(issue);
      
      await queryRunner.commitTransaction();
      
      // Log CANCEL action
      await this.auditLogService.log({
        module: 'STOCK_ISSUE',
        action: 'CANCEL',
        documentId: issue.id,
        documentNo: issue.docFullNo,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { previousStatus: 'POSTED', totalAmount: issue.totalAmount },
      });
      
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number, ctx: AuditContext) {
    const issue = await this.findOne(id);
    if (!['DRAFT', 'CANCELLED'].includes(issue.status)) {
      throw new BadRequestException('Only DRAFT or CANCELLED issues can be deleted');
    }
    
    const docFullNo = issue.docFullNo;
    const previousStatus = issue.status;
    
    await this.itemRepository.delete({ stockIssueId: id });
    await this.issueRepository.delete(id);
    
    // Log DELETE action
    await this.auditLogService.log({
      module: 'STOCK_ISSUE',
      action: 'DELETE',
      documentId: id,
      documentNo: docFullNo,
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { previousStatus },
    });
    
    return { message: 'Deleted successfully' };
  }
}
