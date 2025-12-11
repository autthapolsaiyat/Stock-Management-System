import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PurchaseOrderEntity, PurchaseOrderItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private poRepository: Repository<PurchaseOrderEntity>,
    @InjectRepository(PurchaseOrderItemEntity)
    private itemRepository: Repository<PurchaseOrderItemEntity>,
    private docNumberingService: DocNumberingService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    return this.poRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
  }

  async findOne(id: number) {
    const po = await this.poRepository.findOne({ where: { id }, relations: ['items'] });
    if (!po) throw new NotFoundException('Purchase Order not found');
    return po;
  }

  async create(dto: any, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('PO', queryRunner);
      
      const po = queryRunner.manager.create(PurchaseOrderEntity, {
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
        
        const poItem = queryRunner.manager.create(PurchaseOrderItemEntity, {
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: any, userId: number) {
    const po = await this.findOne(id);
    if (po.status !== 'DRAFT') {
      throw new BadRequestException('Only draft PO can be updated');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete old items
      await queryRunner.manager.delete(PurchaseOrderItemEntity, { purchaseOrderId: id });

      // Create new items
      let subtotal = 0;
      if (dto.items && dto.items.length > 0) {
        for (let i = 0; i < dto.items.length; i++) {
          const item = dto.items[i];
          const lineTotal = (item.qty || 0) * (item.unitPrice || 0) - (item.discountAmount || 0);
          subtotal += lineTotal;

          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(PurchaseOrderItemEntity)
            .values({
              purchaseOrderId: id,
              lineNo: i + 1,
              productId: item.productId,
              qty: item.qty,
              unitPrice: item.unitPrice,
              discountAmount: item.discountAmount || 0,
              lineTotal,
              qtyReceived: 0,
            })
            .execute();
        }
      }

      // Update PO header
      await queryRunner.manager.update(PurchaseOrderEntity, id, {
        supplierId: dto.supplierId ?? po.supplierId,
        docDate: dto.docDate ?? po.docDate,
        remark: dto.remark ?? po.remark,
        updatedBy: userId,
        subtotal,
        taxAmount: subtotal * 0.07,
        grandTotal: subtotal * 1.07,
      });

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async approve(id: number, userId: number) {
    const po = await this.findOne(id);
    if (po.status !== 'DRAFT') throw new BadRequestException('Only draft PO can be approved');
    
    po.status = 'APPROVED';
    po.approvedAt = new Date();
    po.approvedBy = userId;
    return this.poRepository.save(po);
  }

  async cancel(id: number, userId: number) {
    const po = await this.findOne(id);
    if (po.status === 'CANCELLED') throw new BadRequestException('Already cancelled');
    
    po.status = 'CANCELLED';
    po.cancelledAt = new Date();
    po.cancelledBy = userId;
    return this.poRepository.save(po);
  }
}
