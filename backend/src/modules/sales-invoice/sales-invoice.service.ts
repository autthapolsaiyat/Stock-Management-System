import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SalesInvoiceEntity, SalesInvoiceItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
import { QuotationService } from '../quotation/quotation.service';
import { SystemSettingsService } from '../system-settings/system-settings.service';

@Injectable()
export class SalesInvoiceService {
  constructor(
    @InjectRepository(SalesInvoiceEntity)
    private invoiceRepository: Repository<SalesInvoiceEntity>,
    @InjectRepository(SalesInvoiceItemEntity)
    private itemRepository: Repository<SalesInvoiceItemEntity>,
    private docNumberingService: DocNumberingService,
    private fifoService: FifoService,
    private quotationService: QuotationService,
    private settingsService: SystemSettingsService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    return this.invoiceRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!invoice) throw new NotFoundException('Sales invoice not found');
    return invoice;
  }

  async findByQuotation(quotationId: number) {
    return this.invoiceRepository.find({
      where: { quotationId, isLatestRevision: true },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: any, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('INV', queryRunner);
      const varianceThreshold = await this.settingsService.getVarianceAlertPercent();

      const invoice = queryRunner.manager.create(SalesInvoiceEntity, {
        docBaseNo,
        docFullNo,
        docRevision: 1,
        isLatestRevision: true,
        quotationId: dto.quotationId,
        quotationDocNo: dto.quotationDocNo,
        customerId: dto.customerId,
        customerName: dto.customerName,
        customerAddress: dto.customerAddress,
        contactPerson: dto.contactPerson,
        warehouseId: dto.warehouseId,
        warehouseName: dto.warehouseName,
        docDate: dto.docDate || new Date(),
        dueDate: dto.dueDate,
        creditTermDays: dto.creditTermDays || 30,
        publicNote: dto.publicNote,
        internalNote: dto.internalNote,
        remark: dto.remark,
        status: 'DRAFT',
        createdBy: userId,
      });

      const savedInvoice = await queryRunner.manager.save(invoice);

      let subtotal = 0;
      let costTotal = 0;
      let hasPriceVariance = false;

      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        const netPrice = item.unitPrice - (item.discountAmount || 0);
        const lineTotal = item.qty * netPrice;
        subtotal += lineTotal;

        // Calculate price variance from quotation
        const quotedPrice = item.quotedPrice || item.unitPrice;
        const priceVariance = item.unitPrice - quotedPrice;
        const priceVariancePercent = quotedPrice > 0 ? (priceVariance / quotedPrice) * 100 : 0;
        const itemHasVariance = Math.abs(priceVariancePercent) > varianceThreshold;

        if (itemHasVariance) hasPriceVariance = true;

        const invoiceItem = queryRunner.manager.create(SalesInvoiceItemEntity, {
          salesInvoiceId: savedInvoice.id,
          lineNo: i + 1,
          quotationItemId: item.quotationItemId,
          productId: item.productId,
          itemCode: item.itemCode,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          brand: item.brand,
          qty: item.qty,
          unit: item.unit || 'ea',
          unitPrice: item.unitPrice,
          discountPercent: item.discountPercent || 0,
          discountAmount: item.discountAmount || 0,
          netPrice: netPrice,
          lineTotal: lineTotal,
          quotedPrice: quotedPrice,
          priceVariance: priceVariance,
          priceVariancePercent: priceVariancePercent,
          hasPriceVariance: itemHasVariance,
          priceAdjustmentReason: item.priceAdjustmentReason,
          internalNote: item.internalNote,
        });

        await queryRunner.manager.save(invoiceItem);
      }

      // Calculate totals
      const discountTotal = dto.discountTotal || (subtotal * (dto.discountPercent || 0) / 100);
      const afterDiscount = subtotal - discountTotal;
      const taxAmount = afterDiscount * (dto.taxRate || 7) / 100;
      const grandTotal = afterDiscount + taxAmount;

      savedInvoice.subtotal = subtotal;
      savedInvoice.discountPercent = dto.discountPercent || 0;
      savedInvoice.discountTotal = discountTotal;
      savedInvoice.afterDiscount = afterDiscount;
      savedInvoice.taxRate = dto.taxRate || 7;
      savedInvoice.taxAmount = taxAmount;
      savedInvoice.grandTotal = grandTotal;
      savedInvoice.hasPriceVariance = hasPriceVariance;

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

  async createFromQuotation(quotationId: number, dto: any, userId: number) {
    const quotation = await this.quotationService.findOne(quotationId);

    if (!['APPROVED', 'SENT', 'PARTIALLY_CLOSED'].includes(quotation.status)) {
      throw new BadRequestException('Quotation must be approved before creating invoice');
    }

    // Get items ready for invoicing (received from GR)
    const readyItems = quotation.items.filter(item =>
      item.itemStatus !== 'CANCELLED' &&
      item.qtyReceived > 0 &&
      item.qtySold < item.qtyReceived &&
      (!dto.itemIds || dto.itemIds.includes(item.id))
    );

    if (readyItems.length === 0) {
      throw new BadRequestException('No items ready for invoicing');
    }

    const invoiceDto = {
      quotationId: quotation.id,
      quotationDocNo: quotation.docFullNo,
      customerId: quotation.customerId,
      customerName: quotation.customerName,
      customerAddress: quotation.customerAddress,
      contactPerson: quotation.contactPerson,
      warehouseId: dto.warehouseId,
      warehouseName: dto.warehouseName,
      docDate: dto.docDate || new Date(),
      dueDate: dto.dueDate || new Date(Date.now() + quotation.creditTermDays * 24 * 60 * 60 * 1000),
      creditTermDays: quotation.creditTermDays,
      publicNote: dto.publicNote,
      internalNote: dto.internalNote,
      remark: dto.remark,
      items: readyItems.map(item => {
        const qtyToInvoice = dto.quantities?.[item.id] || (item.qtyReceived - item.qtySold);
        return {
          quotationItemId: item.id,
          productId: item.productId,
          itemCode: item.itemCode,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          brand: item.brand,
          qty: qtyToInvoice,
          unit: item.unit,
          unitPrice: dto.prices?.[item.id] || item.unitPrice,
          quotedPrice: item.unitPrice,
          discountAmount: item.discountAmount,
          priceAdjustmentReason: dto.priceReasons?.[item.id],
        };
      }),
    };

    return this.create(invoiceDto, userId);
  }

  async approvePriceVariance(id: number, userId: number) {
    const invoice = await this.findOne(id);

    if (!invoice.hasPriceVariance) {
      throw new BadRequestException('Invoice has no price variance');
    }

    invoice.priceVarianceApproved = true;
    invoice.priceVarianceApprovedBy = userId;
    invoice.priceVarianceApprovedAt = new Date();
    invoice.updatedBy = userId;

    return this.invoiceRepository.save(invoice);
  }

  async post(id: number, userId: number) {
    const invoice = await this.findOne(id);

    if (invoice.status !== 'DRAFT') {
      throw new BadRequestException('Only draft invoices can be posted');
    }

    if (invoice.hasPriceVariance && !invoice.priceVarianceApproved) {
      throw new BadRequestException('Price variance must be approved before posting');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalCost = 0;

      for (const item of invoice.items) {
        // Deduct from FIFO
        const deductResult = await this.fifoService.deductFifo(
          item.productId,
          invoice.warehouseId,
          Number(item.qty),
          'INV',
          invoice.id,
          item.id,
          queryRunner,
        );

        const unitCost = deductResult.totalCost / Number(item.qty);
        const costItemTotal = deductResult.totalCost;
        const profitAmount = Number(item.lineTotal) - costItemTotal;
        const profitPercent = Number(item.lineTotal) > 0 ? (profitAmount / Number(item.lineTotal)) * 100 : 0;

        item.unitCost = unitCost;
        item.costTotal = costItemTotal;
        item.profitAmount = profitAmount;
        item.profitPercent = profitPercent;

        await queryRunner.manager.save(item);
        totalCost += costItemTotal;

        // Update Quotation Item
        if (item.quotationItemId) {
          await queryRunner.manager.query(`
            UPDATE quotation_items 
            SET qty_sold = qty_sold + $1,
                qty_remaining = GREATEST(0, qty_remaining - $1),
                invoice_price = $2,
                item_status = CASE 
                  WHEN qty_remaining - $1 <= 0 THEN 'SOLD'
                  ELSE 'PARTIAL'
                END,
                invoice_item_id = $3
            WHERE id = $4
          `, [item.qty, item.unitPrice, item.id, item.quotationItemId]);
        }
      }

      // Update invoice totals
      const profitTotal = Number(invoice.subtotal) - totalCost;
      const profitPercent = Number(invoice.subtotal) > 0 ? (profitTotal / Number(invoice.subtotal)) * 100 : 0;

      invoice.costTotal = totalCost;
      invoice.profitTotal = profitTotal;
      invoice.profitPercent = profitPercent;
      invoice.status = 'POSTED';
      invoice.postedAt = new Date();
      invoice.postedBy = userId;
      invoice.updatedBy = userId;

      await queryRunner.manager.save(invoice);

      // Update Quotation fulfillment status
      if (invoice.quotationId) {
        await this.quotationService.updateFulfillmentSummary(invoice.quotationId);
      }

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(id: number, userId: number, reason?: string) {
    const invoice = await this.findOne(id);

    if (invoice.status === 'CANCELLED') {
      throw new BadRequestException('Invoice is already cancelled');
    }

    if (invoice.status === 'POSTED') {
      throw new BadRequestException('Posted invoice cannot be cancelled');
    }

    invoice.status = 'CANCELLED';
    invoice.cancelledAt = new Date();
    invoice.cancelledBy = userId;
    invoice.cancelReason = reason;
    invoice.updatedBy = userId;

    return this.invoiceRepository.save(invoice);
  }

  async getProfitReport(id: number) {
    const invoice = await this.findOne(id);

    return {
      invoice: {
        id: invoice.id,
        docFullNo: invoice.docFullNo,
        customerName: invoice.customerName,
        subtotal: invoice.subtotal,
        costTotal: invoice.costTotal,
        profitTotal: invoice.profitTotal,
        profitPercent: invoice.profitPercent,
      },
      items: invoice.items.map(item => ({
        itemName: item.itemName,
        qty: item.qty,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        unitCost: item.unitCost,
        costTotal: item.costTotal,
        profitAmount: item.profitAmount,
        profitPercent: item.profitPercent,
      })),
    };
  }
}
