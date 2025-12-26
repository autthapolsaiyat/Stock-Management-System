import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TaxInvoiceEntity, TaxInvoiceLineEntity } from '../entities/tax-invoice.entity';
import { WithholdingTaxEntity } from '../entities/withholding-tax.entity';
import { FixedAssetEntity, DepreciationHistoryEntity } from '../entities/fixed-asset.entity';
import { JournalEntryEntity } from '../entities/journal-entry.entity';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(TaxInvoiceEntity)
    private taxInvoiceRepo: Repository<TaxInvoiceEntity>,
    @InjectRepository(TaxInvoiceLineEntity)
    private taxInvoiceLineRepo: Repository<TaxInvoiceLineEntity>,
    @InjectRepository(WithholdingTaxEntity)
    private withholdingTaxRepo: Repository<WithholdingTaxEntity>,
    @InjectRepository(FixedAssetEntity)
    private fixedAssetRepo: Repository<FixedAssetEntity>,
    @InjectRepository(DepreciationHistoryEntity)
    private depreciationRepo: Repository<DepreciationHistoryEntity>,
    @InjectRepository(JournalEntryEntity)
    private journalEntryRepo: Repository<JournalEntryEntity>,
  ) {}

  // ==================== TAX INVOICES ====================

  async getTaxInvoices(startDate?: string, endDate?: string, docType?: string) {
    const where: any = {};
    if (startDate && endDate) {
      where.docDate = Between(new Date(startDate), new Date(endDate));
    }
    if (docType) {
      where.docType = docType;
    }
    return this.taxInvoiceRepo.find({
      where,
      order: { docDate: 'DESC', id: 'DESC' },
    });
  }

  async getTaxInvoiceById(id: number) {
    return this.taxInvoiceRepo.findOne({ where: { id } });
  }

  async createTaxInvoice(data: any, userId: number) {
    const year = new Date().getFullYear();
    const prefix = data.docType === 'TAX_INVOICE' ? 'TI' : data.docType === 'DEBIT_NOTE' ? 'DN' : 'CN';
    const count = await this.taxInvoiceRepo.count({ where: { docType: data.docType } });
    const docNo = `${prefix}${year}-${String(count + 1).padStart(5, '0')}`;

    const invoice = this.taxInvoiceRepo.create({
      ...data,
      docNo,
      createdBy: userId,
    });
    const saved = await this.taxInvoiceRepo.save(invoice);

    if (data.lines && data.lines.length > 0) {
      const lines = data.lines.map((line: any) => ({
        ...line,
        taxInvoiceId: saved.id,
      }));
      await this.taxInvoiceLineRepo.save(lines);
    }

    return this.getTaxInvoiceById(saved.id);
  }

  async issueTaxInvoice(id: number) {
    await this.taxInvoiceRepo.update(id, { status: 'ISSUED' });
    return this.getTaxInvoiceById(id);
  }

  async cancelTaxInvoice(id: number, reason: string) {
    await this.taxInvoiceRepo.update(id, { status: 'CANCELLED', reason });
    return this.getTaxInvoiceById(id);
  }

  async deleteTaxInvoice(id: number) {
    await this.taxInvoiceRepo.delete(id);
    return { success: true };
  }

  // ==================== WITHHOLDING TAX ====================

  async getWithholdingTaxes(startDate?: string, endDate?: string, formType?: string) {
    const where: any = {};
    if (startDate && endDate) {
      where.paymentDate = Between(new Date(startDate), new Date(endDate));
    }
    if (formType) {
      where.formType = formType;
    }
    return this.withholdingTaxRepo.find({
      where,
      order: { paymentDate: 'DESC', id: 'DESC' },
    });
  }

  async getWithholdingTaxById(id: number) {
    return this.withholdingTaxRepo.findOne({ where: { id } });
  }

  async createWithholdingTax(data: any, userId: number) {
    const year = new Date().getFullYear();
    const count = await this.withholdingTaxRepo.count();
    const docNo = `WHT${year}-${String(count + 1).padStart(5, '0')}`;

    const wht = this.withholdingTaxRepo.create({
      ...data,
      docNo,
      createdBy: userId,
    });
    return this.withholdingTaxRepo.save(wht);
  }

  async issueWithholdingTax(id: number) {
    await this.withholdingTaxRepo.update(id, { status: 'ISSUED' });
    return this.getWithholdingTaxById(id);
  }

  async deleteWithholdingTax(id: number) {
    await this.withholdingTaxRepo.delete(id);
    return { success: true };
  }

  // ==================== VAT REPORT ====================

  async getOutputVat(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const invoices = await this.taxInvoiceRepo.find({
      where: {
        docDate: Between(startDate, endDate),
        status: 'ISSUED',
        docType: 'TAX_INVOICE',
      },
      order: { docDate: 'ASC' },
    });

    return invoices.map((inv) => ({
      id: inv.id,
      docNo: inv.docNo,
      docDate: inv.docDate,
      partnerName: inv.customerName,
      partnerTaxId: inv.customerTaxId,
      description: 'ขายสินค้า/บริการ',
      baseAmount: Number(inv.subtotal),
      vatRate: Number(inv.vatRate),
      vatAmount: Number(inv.vatAmount),
      totalAmount: Number(inv.totalAmount),
    }));
  }

  async getInputVat(year: number, month: number) {
    return [];
  }

  async getVatSummary(year: number, month: number) {
    const outputVat = await this.getOutputVat(year, month);
    const inputVat = await this.getInputVat(year, month);

    const outputVatTotal = outputVat.reduce((sum, v) => sum + v.vatAmount, 0);
    const inputVatTotal = inputVat.reduce((sum, v) => sum + v.vatAmount, 0);
    const netVat = outputVatTotal - inputVatTotal;

    return {
      period: `${month}/${year}`,
      year,
      month,
      outputVat: outputVatTotal,
      outputVatCount: outputVat.length,
      inputVat: inputVatTotal,
      inputVatCount: inputVat.length,
      netVat,
      isPayable: netVat > 0,
    };
  }

  // ==================== FIXED ASSETS ====================

  async getFixedAssets(category?: string, status?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    return this.fixedAssetRepo.find({
      where,
      order: { assetCode: 'ASC' },
    });
  }

  async getFixedAssetById(id: number) {
    return this.fixedAssetRepo.findOne({ where: { id } });
  }

  async createFixedAsset(data: any, userId: number) {
    const asset = this.fixedAssetRepo.create({
      ...data,
      netBookValue: data.acquisitionCost,
      createdBy: userId,
    });
    return this.fixedAssetRepo.save(asset);
  }

  async updateFixedAsset(id: number, data: any) {
    await this.fixedAssetRepo.update(id, data);
    return this.getFixedAssetById(id);
  }

  async deleteFixedAsset(id: number) {
    await this.fixedAssetRepo.delete(id);
    return { success: true };
  }

  async disposeFixedAsset(id: number, data: { disposalDate: string; disposalAmount: number }) {
    await this.fixedAssetRepo.update(id, {
      status: 'DISPOSED',
      disposalDate: new Date(data.disposalDate),
      disposalAmount: data.disposalAmount,
    });
    return this.getFixedAssetById(id);
  }

  async calculateDepreciation(year: number, month: number) {
    const assets = await this.fixedAssetRepo.find({ where: { status: 'ACTIVE' } });

    for (const asset of assets) {
      const existing = await this.depreciationRepo.findOne({
        where: { fixedAssetId: asset.id, year, month },
      });
      if (existing) continue;

      const depreciableAmount = Number(asset.acquisitionCost) - Number(asset.salvageValue);
      const monthlyDepreciation = depreciableAmount / (asset.usefulLife * 12);
      const newAccumulated = Number(asset.accumulatedDepreciation) + monthlyDepreciation;
      const newNetBookValue = Number(asset.acquisitionCost) - newAccumulated;

      const history = this.depreciationRepo.create({
        fixedAssetId: asset.id,
        year,
        month,
        depreciationAmount: monthlyDepreciation,
        accumulatedDepreciation: newAccumulated,
        netBookValue: Math.max(newNetBookValue, Number(asset.salvageValue)),
      });
      await this.depreciationRepo.save(history);

      const status = newNetBookValue <= Number(asset.salvageValue) ? 'FULLY_DEPRECIATED' : 'ACTIVE';
      await this.fixedAssetRepo.update(asset.id, {
        accumulatedDepreciation: newAccumulated,
        netBookValue: Math.max(newNetBookValue, Number(asset.salvageValue)),
        status,
      });
    }

    return { success: true, message: `Calculated depreciation for ${assets.length} assets` };
  }

  // ==================== CASH FLOW ====================

  async getCashFlowStatement(startDate: string, endDate: string) {
    const operatingItems = [
      { description: 'กำไรสุทธิ', amount: 0, isSubtotal: false },
      { description: 'ค่าเสื่อมราคา', amount: 0, isSubtotal: false },
      { description: 'การเปลี่ยนแปลงในลูกหนี้', amount: 0, isSubtotal: false },
      { description: 'การเปลี่ยนแปลงในสินค้าคงเหลือ', amount: 0, isSubtotal: false },
      { description: 'การเปลี่ยนแปลงในเจ้าหนี้', amount: 0, isSubtotal: false },
    ];

    const investingItems = [
      { description: 'ซื้อสินทรัพย์ถาวร', amount: 0, isSubtotal: false },
      { description: 'ขายสินทรัพย์ถาวร', amount: 0, isSubtotal: false },
    ];

    const financingItems = [
      { description: 'เงินกู้ยืม', amount: 0, isSubtotal: false },
      { description: 'ชำระคืนเงินกู้', amount: 0, isSubtotal: false },
      { description: 'จ่ายเงินปันผล', amount: 0, isSubtotal: false },
    ];

    return {
      period: { startDate, endDate },
      operatingActivities: { items: operatingItems, total: 0 },
      investingActivities: { items: investingItems, total: 0 },
      financingActivities: { items: financingItems, total: 0 },
      summary: {
        netCashFromOperating: 0,
        netCashFromInvesting: 0,
        netCashFromFinancing: 0,
        netChangeInCash: 0,
        beginningCash: 0,
        endingCash: 0,
      },
    };
  }
}
