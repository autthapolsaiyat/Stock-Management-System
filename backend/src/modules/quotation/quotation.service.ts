import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { QuotationEntity, QuotationItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(QuotationEntity)
    private quotationRepository: Repository<QuotationEntity>,
    @InjectRepository(QuotationItemEntity)
    private itemRepository: Repository<QuotationItemEntity>,
    private docNumberingService: DocNumberingService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    return this.quotationRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
  }

  async findOne(id: number) {
    const quotation = await this.quotationRepository.findOne({ where: { id }, relations: ['items'] });
    if (!quotation) throw new NotFoundException('Quotation not found');
    return quotation;
  }

  async create(dto: any, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('QT', queryRunner);
      
      const quotation = queryRunner.manager.create(QuotationEntity, {
        docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
        docDate: dto.docDate || new Date(),
        validUntil: dto.validUntil || new Date(Date.now() + 30*24*60*60*1000),
        customerId: dto.customerId,
        status: 'DRAFT',
        createdBy: userId,
      });
      const savedQuotation = await queryRunner.manager.save(quotation);
      
      let subtotal = 0;
      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        const lineTotal = item.qty * item.unitPrice - (item.discountAmount || 0);
        subtotal += lineTotal;
        
        const quotationItem = queryRunner.manager.create(QuotationItemEntity, {
          quotationId: savedQuotation.id,
          lineNo: i + 1,
          productId: item.productId,
          qty: item.qty,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount || 0,
          lineTotal,
        });
        await queryRunner.manager.save(quotationItem);
      }
      
      savedQuotation.subtotal = subtotal;
      savedQuotation.taxAmount = subtotal * 0.07;
      savedQuotation.grandTotal = subtotal * 1.07;
      await queryRunner.manager.save(savedQuotation);
      
      await queryRunner.commitTransaction();
      return this.findOne(savedQuotation.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async confirm(id: number, userId: number) {
    const quotation = await this.findOne(id);
    if (quotation.status !== 'DRAFT') throw new BadRequestException('Only draft quotations can be confirmed');
    
    quotation.status = 'CONFIRMED';
    quotation.confirmedAt = new Date();
    quotation.confirmedBy = userId;
    return this.quotationRepository.save(quotation);
  }

  async cancel(id: number, userId: number) {
    const quotation = await this.findOne(id);
    if (quotation.status === 'CANCELLED') throw new BadRequestException('Already cancelled');
    
    quotation.status = 'CANCELLED';
    quotation.cancelledAt = new Date();
    quotation.cancelledBy = userId;
    return this.quotationRepository.save(quotation);
  }
}
