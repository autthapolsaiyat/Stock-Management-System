import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GoodsReceiptEntity, GoodsReceiptItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';

@Injectable()
export class GoodsReceiptService {
  constructor(
    @InjectRepository(GoodsReceiptEntity)
    private grnRepository: Repository<GoodsReceiptEntity>,
    @InjectRepository(GoodsReceiptItemEntity)
    private itemRepository: Repository<GoodsReceiptItemEntity>,
    private docNumberingService: DocNumberingService,
    private fifoService: FifoService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    return this.grnRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
  }

  async findOne(id: number) {
    const grn = await this.grnRepository.findOne({ where: { id }, relations: ['items'] });
    if (!grn) throw new NotFoundException('GRN not found');
    return grn;
  }

  async create(dto: any, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('GR', queryRunner);
      
      const grn = queryRunner.manager.create(GoodsReceiptEntity, {
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
        
        const grnItem = queryRunner.manager.create(GoodsReceiptItemEntity, {
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: number, userId: number) {
    const grn = await this.findOne(id);
    if (grn.status !== 'DRAFT') throw new BadRequestException('Only draft GRN can be posted');
    
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(id: number, userId: number) {
    const grn = await this.findOne(id);
    if (grn.status === 'POSTED') throw new BadRequestException('Posted GRN cannot be cancelled');
    
    grn.status = 'CANCELLED';
    grn.cancelledAt = new Date();
    grn.cancelledBy = userId;
    return this.grnRepository.save(grn);
  }
}
