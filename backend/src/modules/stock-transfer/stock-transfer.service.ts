import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockTransferEntity, StockTransferItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditContext } from '../stock-issue/stock-issue.service';

@Injectable()
export class StockTransferService {
  constructor(
    @InjectRepository(StockTransferEntity)
    private transferRepository: Repository<StockTransferEntity>,
    @InjectRepository(StockTransferItemEntity)
    private itemRepository: Repository<StockTransferItemEntity>,
    private docNumberingService: DocNumberingService,
    private fifoService: FifoService,
    private auditLogService: AuditLogService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string, ctx?: AuditContext) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    const result = await this.transferRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'STOCK_TRANSFER',
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
    const transfer = await this.transferRepository.findOne({ where: { id }, relations: ['items'] });
    if (!transfer) throw new NotFoundException('Stock Transfer not found');
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'STOCK_TRANSFER',
        action: 'VIEW',
        documentId: transfer.id,
        documentNo: transfer.docFullNo,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
      });
    }
    
    return transfer;
  }

  async create(dto: any, ctx: AuditContext) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('TR', queryRunner);
      
      const transfer = queryRunner.manager.create(StockTransferEntity, {
        docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
        docDate: dto.docDate || new Date(),
        fromWarehouseId: dto.fromWarehouseId,
        toWarehouseId: dto.toWarehouseId,
        reason: dto.reason,
        status: 'DRAFT',
        createdBy: ctx.userId,
      });
      const savedTransfer = await queryRunner.manager.save(transfer);
      
      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        const transferItem = queryRunner.manager.create(StockTransferItemEntity, {
          stockTransferId: savedTransfer.id,
          lineNo: i + 1,
          productId: item.productId,
          qty: item.qty,
        });
        await queryRunner.manager.save(transferItem);
      }
      
      await queryRunner.commitTransaction();
      
      await this.auditLogService.log({
        module: 'STOCK_TRANSFER',
        action: 'CREATE',
        documentId: savedTransfer.id,
        documentNo: docFullNo,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { 
          fromWarehouseId: dto.fromWarehouseId,
          toWarehouseId: dto.toWarehouseId,
          reason: dto.reason,
          itemCount: dto.items.length,
        },
      });
      
      return this.findOne(savedTransfer.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: number, ctx: AuditContext) {
    const transfer = await this.findOne(id);
    if (transfer.status !== 'DRAFT') throw new BadRequestException('Only draft can be posted');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      let totalAmount = 0;
      for (const item of transfer.items) {
        const result = await this.fifoService.deductFifo(
          item.productId, transfer.fromWarehouseId, Number(item.qty),
          'TRANSFER', transfer.id, item.id, queryRunner
        );
        
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
      transfer.postedBy = ctx.userId;
      await queryRunner.manager.save(transfer);
      
      await queryRunner.commitTransaction();
      
      await this.auditLogService.log({
        module: 'STOCK_TRANSFER',
        action: 'POST',
        documentId: transfer.id,
        documentNo: transfer.docFullNo,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { totalAmount, itemCount: transfer.items.length },
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
    const transfer = await this.findOne(id);
    if (transfer.status !== 'POSTED') throw new BadRequestException('Only posted transfers can be cancelled');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      for (const item of transfer.items) {
        await this.fifoService.createLayer({
          productId: item.productId,
          warehouseId: transfer.fromWarehouseId,
          qty: Number(item.qty),
          unitCost: Number(item.unitCost),
          referenceType: 'TRANSFER_CANCEL',
          referenceId: transfer.id,
          referenceItemId: item.id,
        }, queryRunner);
        
        await this.fifoService.deductFifo(
          item.productId, transfer.toWarehouseId, Number(item.qty),
          'TRANSFER_CANCEL', transfer.id, item.id, queryRunner
        );
      }
      
      transfer.status = 'CANCELLED';
      transfer.cancelledAt = new Date();
      transfer.cancelledBy = ctx.userId;
      await queryRunner.manager.save(transfer);
      
      await queryRunner.commitTransaction();
      
      await this.auditLogService.log({
        module: 'STOCK_TRANSFER',
        action: 'CANCEL',
        documentId: transfer.id,
        documentNo: transfer.docFullNo,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { previousStatus: 'POSTED', totalAmount: transfer.totalAmount },
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
    const transfer = await this.findOne(id);
    if (!['DRAFT', 'CANCELLED'].includes(transfer.status)) {
      throw new BadRequestException('Only DRAFT or CANCELLED transfers can be deleted');
    }
    
    const docFullNo = transfer.docFullNo;
    const previousStatus = transfer.status;
    
    await this.itemRepository.delete({ stockTransferId: id });
    await this.transferRepository.delete(id);
    
    await this.auditLogService.log({
      module: 'STOCK_TRANSFER',
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
