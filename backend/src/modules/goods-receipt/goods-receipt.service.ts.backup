import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { GoodsReceiptEntity, GoodsReceiptItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { TempProductService } from '../temp-product/temp-product.service';
import { SystemSettingsService } from '../system-settings/system-settings.service';

@Injectable()
export class GoodsReceiptService {
  constructor(
    @InjectRepository(GoodsReceiptEntity)
    private grRepository: Repository<GoodsReceiptEntity>,
    @InjectRepository(GoodsReceiptItemEntity)
    private itemRepository: Repository<GoodsReceiptItemEntity>,
    private docNumberingService: DocNumberingService,
    private fifoService: FifoService,
    private poService: PurchaseOrderService,
    private tempProductService: TempProductService,
    private settingsService: SystemSettingsService,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = { isLatestRevision: true };
    if (status) where.status = status;
    return this.grRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });
  }

  async findOne(id: number) {
    const gr = await this.grRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!gr) throw new NotFoundException('Goods receipt not found');
    return gr;
  }

  async findByPO(purchaseOrderId: number) {
    return this.grRepository.find({
      where: { purchaseOrderId, isLatestRevision: true },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByQuotation(quotationId: number) {
    // 1. ค้นหา GR ที่มี quotationId โดยตรง
    const directGRs = await this.grRepository.find({
      where: { quotationId, isLatestRevision: true },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    // 2. ค้นหา PO ที่เชื่อมกับ quotation แล้วหา GR ที่เชื่อมกับ PO เหล่านั้น
    const pos = await this.poService.findByQuotation(quotationId);
    const poIds = pos.map((po: any) => po.id);

    let poGRs: GoodsReceiptEntity[] = [];
    if (poIds.length > 0) {
      poGRs = await this.grRepository.find({
        where: { 
          purchaseOrderId: In(poIds), 
          isLatestRevision: true 
        },
        relations: ['items'],
        order: { createdAt: 'DESC' },
      });
    }

    // 3. รวมผลและ deduplicate
    const allGRs = [...directGRs, ...poGRs];
    const uniqueGRs = allGRs.filter((gr, index, self) =>
      index === self.findIndex(g => g.id === gr.id)
    );

    return uniqueGRs.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async create(dto: any, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('GR', queryRunner);
      const varianceThreshold = await this.settingsService.getVarianceAlertPercent();

      const gr = queryRunner.manager.create(GoodsReceiptEntity, {
        docBaseNo,
        docFullNo,
        docRevision: 1,
        isLatestRevision: true,
        purchaseOrderId: dto.purchaseOrderId,
        purchaseOrderDocNo: dto.purchaseOrderDocNo,
        quotationId: dto.quotationId,
        quotationDocNo: dto.quotationDocNo,
        supplierId: dto.supplierId,
        supplierName: dto.supplierName,
        warehouseId: dto.warehouseId,
        warehouseName: dto.warehouseName,
        docDate: dto.docDate || new Date(),
        receiveDate: dto.receiveDate || new Date(),
        supplierInvoiceNo: dto.supplierInvoiceNo,
        supplierInvoiceDate: dto.supplierInvoiceDate,
        internalNote: dto.internalNote,
        remark: dto.remark,
        status: 'DRAFT',
        createdBy: userId,
      });

      const savedGR = await queryRunner.manager.save(gr);

      let subtotal = 0;
      let totalExpectedCost = 0;
      let hasVarianceAlert = false;

      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        const lineTotal = item.qty * item.unitCost;
        subtotal += lineTotal;

        // Calculate variance
        const expectedUnitCost = item.expectedUnitCost || item.unitCost;
        const costVariance = item.unitCost - expectedUnitCost;
        const variancePercent = expectedUnitCost > 0 ? (costVariance / expectedUnitCost) * 100 : 0;
        const itemHasAlert = Math.abs(variancePercent) > varianceThreshold;

        if (itemHasAlert) hasVarianceAlert = true;
        totalExpectedCost += item.qty * expectedUnitCost;

        const grItem = queryRunner.manager.create(GoodsReceiptItemEntity, {
          goodsReceiptId: savedGR.id,
          lineNo: i + 1,
          poItemId: item.poItemId,
          quotationItemId: item.quotationItemId,
          sourceType: item.sourceType || 'MASTER',
          productId: item.productId || null,
          tempProductId: item.sourceType === 'TEMP' ? item.tempProductId : null,
          itemCode: item.itemCode,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          brand: item.brand,
          qty: item.qty,
          unit: item.unit || 'ea',
          unitCost: item.unitCost,
          lineTotal: lineTotal,
          expectedUnitCost: expectedUnitCost,
          costVariance: costVariance,
          variancePercent: variancePercent,
          hasVarianceAlert: itemHasAlert,
          lotNo: item.lotNo,
          expiryDate: item.expiryDate,
          locationCode: item.locationCode,
          internalNote: item.internalNote,
        });

        await queryRunner.manager.save(grItem);
      }

      // Calculate totals
      const totalVariance = subtotal - totalExpectedCost;
      const overallVariancePercent = totalExpectedCost > 0 ? (totalVariance / totalExpectedCost) * 100 : 0;

      savedGR.subtotal = subtotal;
      savedGR.totalAmount = subtotal;
      savedGR.totalExpectedCost = totalExpectedCost;
      savedGR.totalVariance = totalVariance;
      savedGR.variancePercent = overallVariancePercent;
      savedGR.hasVarianceAlert = hasVarianceAlert;

      await queryRunner.manager.save(savedGR);
      await queryRunner.commitTransaction();

      return this.findOne(savedGR.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createFromPO(purchaseOrderId: number, dto: any, userId: number) {
    const poData = await this.poService.getItemsForGR(purchaseOrderId);

    if (poData.pendingItems.length === 0) {
      throw new BadRequestException('No pending items to receive');
    }

    const itemsToReceive = poData.pendingItems.filter(item =>
      !dto.itemIds || dto.itemIds.includes(item.id)
    );

    const grDto = {
      purchaseOrderId: poData.purchaseOrder.id,
      purchaseOrderDocNo: poData.purchaseOrder.docFullNo,
      quotationId: poData.purchaseOrder.quotationId,
      quotationDocNo: poData.purchaseOrder.quotationDocNo,
      supplierId: poData.purchaseOrder.supplierId,
      supplierName: poData.purchaseOrder.supplierName,
      warehouseId: dto.warehouseId,
      warehouseName: dto.warehouseName,
      docDate: dto.docDate || new Date(),
      receiveDate: dto.receiveDate || new Date(),
      supplierInvoiceNo: dto.supplierInvoiceNo,
      supplierInvoiceDate: dto.supplierInvoiceDate,
      internalNote: dto.internalNote,
      remark: dto.remark,
      items: itemsToReceive.map(item => ({
        poItemId: item.id,
        quotationItemId: item.quotationItemId,
        sourceType: item.sourceType,
        productId: item.productId,
        tempProductId: item.tempProductId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        brand: item.brand,
        qty: dto.quantities?.[item.id] || item.qtyRemaining,
        unit: item.unit,
        unitCost: dto.unitCosts?.[item.id] || item.unitPrice,
        expectedUnitCost: item.unitPrice,
        lotNo: dto.lotNos?.[item.id],
        expiryDate: dto.expiryDates?.[item.id],
        locationCode: dto.locationCodes?.[item.id],
      })),
    };

    return this.create(grDto, userId);
  }

  async post(id: number, userId: number) {
    const gr = await this.findOne(id);

    if (gr.status !== 'DRAFT') {
      throw new BadRequestException('Only draft GR can be posted');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of gr.items) {
        // Handle Temp Product activation
        if (item.sourceType === 'TEMP' && item.tempProductId) {
          // Create real product from temp
          const newProduct = await queryRunner.manager.insert('products', {
            code: `PRD-${Date.now()}`,
            name: item.itemName,
            description: item.itemDescription,
            brand: item.brand,
            unit: item.unit,
            isActive: true,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const newProductId = newProduct.identifiers[0].id;

          // Update temp product
          await queryRunner.manager.update('temp_products', item.tempProductId, {
            status: 'ACTIVATED',
            activatedToProductId: newProductId,
            activatedFromGrId: gr.id,
            activatedAt: new Date(),
            activatedBy: userId,
          });

          // Update GR item with new product
          item.activatedProductId = newProductId;
          item.productId = newProductId;
          await queryRunner.manager.save(item);

          // Add to FIFO with new product
          await this.fifoService.createLayer(
            {
              productId: newProductId,
              warehouseId: gr.warehouseId,
              qty: item.qty,
              unitCost: item.unitCost,
              referenceType: 'GR',
              referenceId: gr.id,
            },
            queryRunner,
          );
        } else if (item.productId) {
          // Normal product - add to FIFO
          await this.fifoService.createLayer(
            {
              productId: item.productId,
              warehouseId: gr.warehouseId,
              qty: item.qty,
              unitCost: item.unitCost,
              referenceType: 'GR',
              referenceId: gr.id,
            },
            queryRunner,
          );
        }

        // Update PO Item
        if (item.poItemId) {
          await queryRunner.manager.query(`
            UPDATE purchase_order_items 
            SET qty_received = qty_received + $1,
                qty_remaining = qty_remaining - $1,
                actual_unit_cost = $2,
                item_status = CASE 
                  WHEN qty_remaining - $1 <= 0 THEN 'RECEIVED'
                  ELSE 'PARTIAL'
                END
            WHERE id = $3
          `, [item.qty, item.unitCost, item.poItemId]);
        }

        // Update Quotation Item
        if (item.quotationItemId) {
          await queryRunner.manager.query(`
            UPDATE quotation_items 
            SET qty_received = qty_received + $1,
                actual_cost = $2,
                actual_margin_amount = unit_price - $2,
                actual_margin_percent = CASE 
                  WHEN unit_price > 0 THEN ((unit_price - $2) / unit_price) * 100
                  ELSE 0
                END,
                cost_variance_amount = $2 - COALESCE(estimated_cost, 0),
                cost_variance_percent = CASE 
                  WHEN COALESCE(estimated_cost, 0) > 0 THEN (($2 - estimated_cost) / estimated_cost) * 100
                  ELSE 0
                END,
                item_status = CASE 
                  WHEN qty_received + $1 >= qty_quoted THEN 'RECEIVED'
                  ELSE 'ORDERED'
                END,
                gr_item_id = $3
            WHERE id = $4
          `, [item.qty, item.unitCost, item.id, item.quotationItemId]);
        }
      }

      // Update PO receive status
      if (gr.purchaseOrderId) {
        await this.poService.updateReceiveStatus(gr.purchaseOrderId);
      }

      // Update GR status
      gr.status = 'POSTED';
      gr.postedAt = new Date();
      gr.postedBy = userId;
      gr.updatedBy = userId;

      await queryRunner.manager.save(gr);
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
    const gr = await this.findOne(id);

    if (gr.status === 'CANCELLED') {
      throw new BadRequestException('GR is already cancelled');
    }

    if (gr.status === 'POSTED') {
      throw new BadRequestException('Posted GR cannot be cancelled');
    }

    gr.status = 'CANCELLED';
    gr.cancelledAt = new Date();
    gr.cancelledBy = userId;
    gr.cancelReason = reason;
    gr.updatedBy = userId;

    return this.grRepository.save(gr);
  }

  async getVarianceReport(id: number) {
    const gr = await this.findOne(id);

    const itemsWithVariance = gr.items.filter(item => item.hasVarianceAlert);

    return {
      goodsReceipt: {
        id: gr.id,
        docFullNo: gr.docFullNo,
        totalExpectedCost: gr.totalExpectedCost,
        totalAmount: gr.totalAmount,
        totalVariance: gr.totalVariance,
        variancePercent: gr.variancePercent,
      },
      itemsWithVariance,
      summary: {
        totalItems: gr.items.length,
        itemsWithAlert: itemsWithVariance.length,
        hasAlert: gr.hasVarianceAlert,
      },
    };
  }
  async reverse(id: number, userId: number, reason?: string) {
    const gr = await this.findOne(id);

    if (gr.status !== 'POSTED') {
      throw new BadRequestException('Only posted GR can be reversed');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. สร้าง GR ใหม่เป็น Reverse (qty ติดลบ)
      const { docBaseNo, docFullNo } = await this.docNumberingService.generateDocNumber('GR', queryRunner);

      const reverseGR = queryRunner.manager.create(GoodsReceiptEntity, {
        docBaseNo,
        docFullNo,
        docRevision: 1,
        isLatestRevision: true,
        purchaseOrderId: gr.purchaseOrderId,
        purchaseOrderDocNo: gr.purchaseOrderDocNo,
        quotationId: gr.quotationId,
        quotationDocNo: gr.quotationDocNo,
        supplierId: gr.supplierId,
        supplierName: gr.supplierName,
        warehouseId: gr.warehouseId,
        warehouseName: gr.warehouseName,
        docDate: new Date(),
        receiveDate: new Date(),
        internalNote: `Reverse of ${gr.docFullNo}: ${reason || 'No reason provided'}`,
        remark: gr.remark,
        status: 'POSTED',
        subtotal: -Number(gr.subtotal),
        discountAmount: -Number(gr.discountAmount),
        taxAmount: -Number(gr.taxAmount),
        totalAmount: -Number(gr.totalAmount),
        totalExpectedCost: -Number(gr.totalExpectedCost),
        totalVariance: 0,
        variancePercent: 0,
        hasVarianceAlert: false,
        postedAt: new Date(),
        postedBy: userId,
        createdBy: userId,
        reversedFromId: gr.id,
      });

      const savedReverseGR = await queryRunner.manager.save(reverseGR);

      // 2. สร้าง items ติดลบ และหัก FIFO
      for (const item of gr.items) {
        const reverseItem = queryRunner.manager.create(GoodsReceiptItemEntity, {
          goodsReceiptId: savedReverseGR.id,
          lineNo: item.lineNo,
          poItemId: item.poItemId,
          quotationItemId: item.quotationItemId,
          sourceType: item.sourceType,
          productId: item.productId,
          tempProductId: item.tempProductId,
          itemCode: item.itemCode,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          brand: item.brand,
          qty: -Number(item.qty),
          unit: item.unit,
          unitCost: Number(item.unitCost),
          lineTotal: -Number(item.lineTotal),
          expectedUnitCost: Number(item.expectedUnitCost),
          costVariance: 0,
          variancePercent: 0,
          hasVarianceAlert: false,
        });

        await queryRunner.manager.save(reverseItem);

        // 3. หัก stock จาก FIFO (consume lot)
        if (item.productId) {
        if (item.productId) {
          await this.fifoService.deductFifo(
            item.productId,
            gr.warehouseId,
            Number(item.qty),
            'GR_REVERSE',
            savedReverseGR.id,
            undefined,
            queryRunner,
          );
        }
        if (item.productId) {
          await this.fifoService.deductFifo(
            item.productId,
            gr.warehouseId,
            Number(item.qty),
            'GR_REVERSE',
            savedReverseGR.id,
            undefined,
            queryRunner,
          );
        }
        if (item.productId) {
          await this.fifoService.deductFifo(
            item.productId,
            gr.warehouseId,
            Number(item.qty),
            'GR_REVERSE',
            savedReverseGR.id,
            undefined,
            queryRunner,
          );
        }
        if (item.productId) {
          await this.fifoService.deductFifo(
            item.productId,
            gr.warehouseId,
            Number(item.qty),
            'GR_REVERSE',
            savedReverseGR.id,
            undefined,
            queryRunner,
          );
        }
        if (item.productId) {
          await this.fifoService.deductFifo(
            item.productId,
            gr.warehouseId,
            Number(item.qty),
            'GR_REVERSE',
            savedReverseGR.id,
            undefined,
            queryRunner,
          );
        }
        if (item.productId) {
          await this.fifoService.deductFifo(
            item.productId,
            gr.warehouseId,
            Number(item.qty),
            'GR_REVERSE',
            savedReverseGR.id,
            undefined,
            queryRunner,
          );
        }
        if (item.productId) {
          await this.fifoService.deductFifo(
            item.productId,
            gr.warehouseId,
            Number(item.qty),
            'GR_REVERSE',
            savedReverseGR.id,
            undefined,
            queryRunner,
          );
        }
        }
      }

      // 4. อัพเดท GR เดิมเป็น REVERSED
      gr.status = 'REVERSED';
      gr.reversedAt = new Date();
      gr.reversedBy = userId;
      gr.reverseReason = reason;
      gr.reversedToId = savedReverseGR.id;
      gr.updatedBy = userId;
      await queryRunner.manager.save(gr);

      await queryRunner.commitTransaction();
      return savedReverseGR;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
