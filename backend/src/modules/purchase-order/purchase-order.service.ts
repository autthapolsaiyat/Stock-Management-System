import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PurchaseOrderEntity, PurchaseOrderItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { QuotationService } from '../quotation/quotation.service';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private poRepository: Repository<PurchaseOrderEntity>,
    @InjectRepository(PurchaseOrderItemEntity)
    private itemRepository: Repository<PurchaseOrderItemEntity>,
    private docNumberingService: DocNumberingService,
    private quotationService: QuotationService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    return this.poRepository.find({ 
      where, 
      order: { createdAt: 'DESC' }, 
      relations: ['items'] 
    });
  }

  async findOne(id: number) {
    const po = await this.poRepository.findOne({ 
      where: { id }, 
      relations: ['items'] 
    });
    if (!po) throw new NotFoundException('Purchase order not found');
    return po;
  }

  async findByQuotation(quotationId: number) {
    return this.poRepository.find({
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
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('PO', queryRunner);

      const po = queryRunner.manager.create(PurchaseOrderEntity, {
        docBaseNo,
        docFullNo,
        docRevision: 1,
        isLatestRevision: true,
        quotationId: dto.quotationId,
        quotationDocNo: dto.quotationDocNo,
        supplierId: dto.supplierId,
        supplierName: dto.supplierName,
        supplierAddress: dto.supplierAddress,
        contactPerson: dto.contactPerson,
        docDate: dto.docDate || new Date(),
        deliveryDate: dto.deliveryDate,
        expectedDeliveryDate: dto.expectedDeliveryDate,
        paymentTermDays: dto.paymentTermDays || 30,
        paymentTermsText: dto.paymentTermsText,
        deliveryTerms: dto.deliveryTerms,
        publicNote: dto.publicNote,
        internalNote: dto.internalNote,
        remark: dto.remark,
        status: 'DRAFT',
        createdBy: userId,
      });

      const savedPO = await queryRunner.manager.save(po);

      let subtotal = 0;
      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        const netPrice = item.unitPrice - (item.discountAmount || 0);
        const lineTotal = item.qty * netPrice;
        subtotal += lineTotal;

        const poItem = queryRunner.manager.create(PurchaseOrderItemEntity, {
          purchaseOrderId: savedPO.id,
          lineNo: i + 1,
          quotationId: item.quotationId || dto.quotationId,
          quotationItemId: item.quotationItemId,
          sourceType: item.sourceType || 'MASTER',
          productId: item.sourceType === 'MASTER' ? item.productId : null,
          tempProductId: item.sourceType === 'TEMP' ? item.tempProductId : null,
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
          qtyOrdered: item.qty,
          qtyRemaining: item.qty,
          itemStatus: 'PENDING',
          internalNote: item.internalNote,
          supplierNote: item.supplierNote,
        });

        await queryRunner.manager.save(poItem);

        // Update Quotation Item if linked
        if (item.quotationItemId) {
          await queryRunner.manager.update('quotation_items', item.quotationItemId, {
            qtyOrdered: () => `qty_ordered + ${item.qty}`,
            itemStatus: 'ORDERED',
            poItemId: poItem.id,
          });
        }
      }

      // Calculate totals
      const discountTotal = dto.discountTotal || (subtotal * (dto.discountPercent || 0) / 100);
      const afterDiscount = subtotal - discountTotal;
      const taxAmount = afterDiscount * (dto.taxRate || 7) / 100;
      const grandTotal = afterDiscount + taxAmount;

      savedPO.subtotal = subtotal;
      savedPO.discountPercent = dto.discountPercent || 0;
      savedPO.discountTotal = discountTotal;
      savedPO.afterDiscount = afterDiscount;
      savedPO.taxRate = dto.taxRate || 7;
      savedPO.taxAmount = taxAmount;
      savedPO.grandTotal = grandTotal;
      savedPO.totalItems = dto.items.length;

      await queryRunner.manager.save(savedPO);
      await queryRunner.commitTransaction();

      return this.findOne(savedPO.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createFromQuotation(quotationId: number, supplierId: number, dto: any, userId: number) {
    const quotation = await this.quotationService.findOne(quotationId);
    
    if (!['APPROVED', 'SENT', 'CONFIRMED', 'PARTIALLY_CLOSED'].includes(quotation.status)) {
      throw new BadRequestException('Quotation must be approved before creating PO');
    }

    // Get supplier info
    const supplierResult = await this.dataSource.query(`
      SELECT name, address, phone, email, payment_term_days 
      FROM suppliers WHERE id = $1
    `, [supplierId]);
    
    const supplier = supplierResult[0] || {};

    // Get items that need ordering
    const itemsToOrder = quotation.items.filter(item => 
      item.itemStatus !== 'CANCELLED' && 
      item.qtyRemaining > 0 &&
      (!dto.itemIds || dto.itemIds.includes(item.id))
    );

    if (itemsToOrder.length === 0) {
      throw new BadRequestException('No items available for ordering');
    }

    const poDto = {
      quotationId: quotation.id,
      quotationDocNo: quotation.docFullNo,
      supplierId: supplierId,
      supplierName: dto.supplierName || supplier.name,
      supplierAddress: dto.supplierAddress || supplier.address,
      supplierPhone: dto.supplierPhone || supplier.phone,
      supplierEmail: dto.supplierEmail || supplier.email,
      contactPerson: dto.contactPerson,
      docDate: dto.docDate || new Date(),
      deliveryDate: dto.deliveryDate,
      expectedDeliveryDate: dto.expectedDeliveryDate || new Date(Date.now() + quotation.deliveryDays * 24 * 60 * 60 * 1000),
      paymentTermDays: dto.paymentTermDays || supplier.payment_term_days || quotation.creditTermDays,
      paymentTermsText: dto.paymentTermsText,
      deliveryTerms: dto.deliveryTerms,
      publicNote: dto.publicNote,
      internalNote: dto.internalNote,
      remark: dto.remark,
      items: itemsToOrder.map(item => ({
        quotationId: quotation.id,
        quotationItemId: item.id,
        sourceType: item.sourceType,
        productId: item.productId,
        tempProductId: item.tempProductId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        brand: item.brand,
        qty: dto.quantities?.[item.id] || item.qtyRemaining,
        unit: item.unit,
        unitPrice: item.estimatedCost > 0 ? item.estimatedCost : item.unitPrice, // Use estimated cost for PO
        internalNote: item.internalNote,
      })),
    };

    return this.create(poDto, userId);
  }

  async update(id: number, dto: any, userId: number) {
    const po = await this.findOne(id);

    if (po.status !== 'DRAFT') {
      throw new BadRequestException('Only draft POs can be updated');
    }

    Object.assign(po, {
      supplierId: dto.supplierId ?? po.supplierId,
      supplierName: dto.supplierName ?? po.supplierName,
      supplierAddress: dto.supplierAddress ?? po.supplierAddress,
      contactPerson: dto.contactPerson ?? po.contactPerson,
      docDate: dto.docDate ?? po.docDate,
      deliveryDate: dto.deliveryDate ?? po.deliveryDate,
      expectedDeliveryDate: dto.expectedDeliveryDate ?? po.expectedDeliveryDate,
      paymentTermDays: dto.paymentTermDays ?? po.paymentTermDays,
      paymentTermsText: dto.paymentTermsText ?? po.paymentTermsText,
      deliveryTerms: dto.deliveryTerms ?? po.deliveryTerms,
      publicNote: dto.publicNote ?? po.publicNote,
      internalNote: dto.internalNote ?? po.internalNote,
      remark: dto.remark ?? po.remark,
      updatedBy: userId,
    });

    return this.poRepository.save(po);
  }

  async submitForApproval(id: number, userId: number) {
    const po = await this.findOne(id);
    if (po.status !== 'DRAFT') {
      throw new BadRequestException('Only draft POs can be submitted');
    }

    po.status = 'PENDING_APPROVAL';
    po.updatedBy = userId;
    return this.poRepository.save(po);
  }

  async approve(id: number, userId: number, note?: string) {
    const po = await this.findOne(id);
    if (!['DRAFT', 'PENDING_APPROVAL'].includes(po.status)) {
      throw new BadRequestException('PO is not pending approval');
    }

    po.status = 'APPROVED';
    po.approvedBy = userId;
    po.approvedAt = new Date();
    po.approvalNote = note;
    po.updatedBy = userId;
    return this.poRepository.save(po);
  }

  async send(id: number, userId: number) {
    const po = await this.findOne(id);
    if (po.status !== 'APPROVED') {
      throw new BadRequestException('Only approved POs can be sent');
    }

    po.status = 'SENT';
    po.updatedBy = userId;
    return this.poRepository.save(po);
  }

  async cancel(id: number, userId: number, reason?: string) {
    const po = await this.findOne(id);
    if (['RECEIVED', 'CANCELLED'].includes(po.status)) {
      throw new BadRequestException('PO cannot be cancelled');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Revert quotation item quantities
      for (const item of po.items) {
        if (item.quotationItemId) {
          await queryRunner.manager.update('quotation_items', item.quotationItemId, {
            qtyOrdered: () => `GREATEST(0, qty_ordered - ${item.qtyOrdered})`,
            itemStatus: 'PENDING',
          });
        }
      }

      po.status = 'CANCELLED';
      po.cancelledAt = new Date();
      po.cancelledBy = userId;
      po.cancelReason = reason;
      po.updatedBy = userId;

      await queryRunner.manager.save(po);
      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateReceiveStatus(id: number) {
    const po = await this.findOne(id);

    let itemsReceived = 0;
    let itemsPartial = 0;

    for (const item of po.items) {
      if (item.qtyReceived >= item.qtyOrdered) {
        itemsReceived++;
      } else if (item.qtyReceived > 0) {
        itemsPartial++;
      }
    }

    const totalItems = po.items.length;
    const receivePercent = totalItems > 0
      ? ((itemsReceived + itemsPartial * 0.5) / totalItems) * 100
      : 0;

    po.itemsReceived = itemsReceived;
    po.itemsPartial = itemsPartial;
    po.receivePercent = receivePercent;

    if (itemsReceived === totalItems) {
      po.status = 'RECEIVED';
    } else if (itemsReceived > 0 || itemsPartial > 0) {
      po.status = 'PARTIAL_RECEIVED';
    }

    await this.poRepository.save(po);
  }

  async getItemsForGR(id: number) {
    const po = await this.findOne(id);

    if (!['APPROVED', 'SENT', 'PARTIAL_RECEIVED'].includes(po.status)) {
      throw new BadRequestException('PO must be approved before receiving');
    }

    const pendingItems = po.items.filter(item => 
      item.itemStatus !== 'RECEIVED' && item.qtyRemaining > 0
    );

    return {
      purchaseOrder: {
        id: po.id,
        docFullNo: po.docFullNo,
        supplierId: po.supplierId,
        supplierName: po.supplierName,
        quotationId: po.quotationId,
        quotationDocNo: po.quotationDocNo,
      },
      pendingItems,
      summary: {
        totalItems: po.items.length,
        received: po.itemsReceived,
        partial: po.itemsPartial,
        pending: pendingItems.length,
      },
    };
  }
}
