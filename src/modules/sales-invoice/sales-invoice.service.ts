import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SalesInvoiceEntity, SalesInvoiceItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';

@Injectable()
export class SalesInvoiceService {
  constructor(
    @InjectRepository(SalesInvoiceEntity)
    private invoiceRepository: Repository<SalesInvoiceEntity>,
    @InjectRepository(SalesInvoiceItemEntity)
    private itemRepository: Repository<SalesInvoiceItemEntity>,
    private docNumberingService: DocNumberingService,
    private fifoService: FifoService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    return this.invoiceRepository.find({ where, order: { createdAt: 'DESC' }, relations: ['items'] });
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepository.findOne({ where: { id }, relations: ['items'] });
    if (!invoice) throw new NotFoundException('Sales Invoice not found');
    return invoice;
  }

  async create(dto: any, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('SI', queryRunner);
      
      const invoice = queryRunner.manager.create(SalesInvoiceEntity, {
        docBaseNo, docFullNo, docRevision: 1, isLatestRevision: true,
        docDate: dto.docDate || new Date(),
        customerId: dto.customerId,
        warehouseId: dto.warehouseId,
        quotationId: dto.quotationId,
        dueDate: dto.dueDate || new Date(Date.now() + 30*24*60*60*1000),
        status: 'DRAFT',
        createdBy: userId,
      });
      const savedInvoice = await queryRunner.manager.save(invoice);
      
      let subtotal = 0;
      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        const lineTotal = item.qty * item.unitPrice - (item.discountAmount || 0);
        subtotal += lineTotal;
        
        const invoiceItem = queryRunner.manager.create(SalesInvoiceItemEntity, {
          salesInvoiceId: savedInvoice.id,
          lineNo: i + 1,
          productId: item.productId,
          qty: item.qty,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount || 0,
          lineTotal,
        });
        await queryRunner.manager.save(invoiceItem);
      }
      
      savedInvoice.subtotal = subtotal;
      savedInvoice.taxAmount = subtotal * 0.07;
      savedInvoice.grandTotal = subtotal * 1.07;
      await queryRunner.manager.save(savedInvoice);
      
      await queryRunner.commitTransaction();
      return this.findOne(savedInvoice.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: number, userId: number) {
    const invoice = await this.findOne(id);
    if (invoice.status !== 'DRAFT') throw new BadRequestException('Only draft can be posted');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      let totalCost = 0;
      for (const item of invoice.items) {
        const result = await this.fifoService.deductFifo(
          item.productId, invoice.warehouseId, Number(item.qty),
          'INVOICE', invoice.id, item.id, queryRunner
        );
        item.unitCost = result.totalCost / Number(item.qty);
        item.costTotal = result.totalCost;
        totalCost += result.totalCost;
        await queryRunner.manager.save(item);
      }
      
      invoice.costTotal = totalCost;
      invoice.profitTotal = Number(invoice.subtotal) - totalCost;
      invoice.status = 'POSTED';
      invoice.postedAt = new Date();
      invoice.postedBy = userId;
      await queryRunner.manager.save(invoice);
      
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
    const invoice = await this.findOne(id);
    if (invoice.status === 'POSTED') throw new BadRequestException('Posted invoice cannot be cancelled');
    
    invoice.status = 'CANCELLED';
    invoice.cancelledAt = new Date();
    invoice.cancelledBy = userId;
    return this.invoiceRepository.save(invoice);
  }
}
