import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { TaxInvoice, TaxInvoiceLine } from './entities/tax-invoice.entity';
import { WithholdingTax } from './entities/withholding-tax.entity';
import { FixedAsset, DepreciationHistory } from './entities/fixed-asset.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { ChartOfAccount } from './entities/chart-of-account.entity';

@Controller('api/accounting')
@UseGuards(JwtAuthGuard)
export class TaxAccountingController {
  constructor(
    @InjectRepository(TaxInvoice)
    private taxInvoiceRepo: Repository<TaxInvoice>,
    @InjectRepository(TaxInvoiceLine)
    private taxInvoiceLineRepo: Repository<TaxInvoiceLine>,
    @InjectRepository(WithholdingTax)
    private withholdingTaxRepo: Repository<WithholdingTax>,
    @InjectRepository(FixedAsset)
    private fixedAssetRepo: Repository<FixedAsset>,
    @InjectRepository(DepreciationHistory)
    private depreciationRepo: Repository<DepreciationHistory>,
    @InjectRepository(JournalEntry)
    private journalEntryRepo: Repository<JournalEntry>,
    @InjectRepository(ChartOfAccount)
    private coaRepo: Repository<ChartOfAccount>,
  ) {}

  // ==========================================
  // TAX INVOICES (ใบกำกับภาษี)
  // ==========================================

  @Get('tax-invoices')
  async getTaxInvoices(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('docType') docType?: string,
  ) {
    const where: any = {};
    
    if (startDate && endDate) {
      where.docDate = Between(new Date(startDate), new Date(endDate));
    }
    if (docType) {
      where.docType = docType;
    }

    return this.taxInvoiceRepo.find({
      where,
      relations: ['lines', 'customer'],
      order: { docDate: 'DESC', id: 'DESC' },
    });
  }

  @Get('tax-invoices/:id')
  async getTaxInvoiceById(@Param('id', ParseIntPipe) id: number) {
    return this.taxInvoiceRepo.findOne({
      where: { id },
      relations: ['lines', 'customer'],
    });
  }

  @Post('tax-invoices')
  async createTaxInvoice(@Body() data: any, @Request() req: any) {
    // Generate doc number
    const year = new Date().getFullYear();
    const prefix = data.docType === 'TAX_INVOICE' ? 'TI' : data.docType === 'DEBIT_NOTE' ? 'DN' : 'CN';
    const count = await this.taxInvoiceRepo.count({
      where: { docType: data.docType },
    });
    const docNo = `${prefix}${year}-${String(count + 1).padStart(5, '0')}`;

    const invoice = this.taxInvoiceRepo.create({
      ...data,
      docNo,
      createdBy: req.user.sub,
    });

    const saved = await this.taxInvoiceRepo.save(invoice);

    // Save lines
    if (data.lines && data.lines.length > 0) {
      const lines = data.lines.map((line: any) => ({
        ...line,
        taxInvoiceId: saved.id,
      }));
      await this.taxInvoiceLineRepo.save(lines);
    }

    return this.getTaxInvoiceById(saved.id);
  }

  @Post('tax-invoices/:id/issue')
  async issueTaxInvoice(@Param('id', ParseIntPipe) id: number) {
    await this.taxInvoiceRepo.update(id, { status: 'ISSUED' });
    return this.getTaxInvoiceById(id);
  }

  @Post('tax-invoices/:id/cancel')
  async cancelTaxInvoice(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string) {
    await this.taxInvoiceRepo.update(id, { status: 'CANCELLED', reason });
    return this.getTaxInvoiceById(id);
  }

  @Delete('tax-invoices/:id')
  async deleteTaxInvoice(@Param('id', ParseIntPipe) id: number) {
    await this.taxInvoiceRepo.delete(id);
    return { success: true };
  }

  // ==========================================
  // WITHHOLDING TAX (หัก ณ ที่จ่าย)
  // ==========================================

  @Get('withholding-tax')
  async getWithholdingTax(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('formType') formType?: string,
  ) {
    const where: any = {};
    
    if (startDate && endDate) {
      where.paymentDate = Between(new Date(startDate), new Date(endDate));
    }
    if (formType) {
      where.formType = formType;
    }

    return this.withholdingTaxRepo.find({
      where,
      relations: ['payee'],
      order: { paymentDate: 'DESC', id: 'DESC' },
    });
  }

  @Get('withholding-tax/:id')
  async getWithholdingTaxById(@Param('id', ParseIntPipe) id: number) {
    return this.withholdingTaxRepo.findOne({
      where: { id },
      relations: ['payee'],
    });
  }

  @Post('withholding-tax')
  async createWithholdingTax(@Body() data: any, @Request() req: any) {
    // Generate doc number
    const year = new Date().getFullYear();
    const count = await this.withholdingTaxRepo.count();
    const docNo = `WHT${year}-${String(count + 1).padStart(5, '0')}`;

    const wht = this.withholdingTaxRepo.create({
      ...data,
      docNo,
      createdBy: req.user.sub,
    });

    return this.withholdingTaxRepo.save(wht);
  }

  @Post('withholding-tax/:id/issue')
  async issueWithholdingTax(@Param('id', ParseIntPipe) id: number) {
    await this.withholdingTaxRepo.update(id, { status: 'ISSUED' });
    return this.getWithholdingTaxById(id);
  }

  @Delete('withholding-tax/:id')
  async deleteWithholdingTax(@Param('id', ParseIntPipe) id: number) {
    await this.withholdingTaxRepo.delete(id);
    return { success: true };
  }

  // ==========================================
  // VAT REPORT (รายงาน VAT)
  // ==========================================

  @Get('vat-report/output')
  async getOutputVat(@Query('year') year: number, @Query('month') month: number) {
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

  @Get('vat-report/input')
  async getInputVat(@Query('year') year: number, @Query('month') month: number) {
    // For input VAT, we would typically get from purchase invoices/goods receipts
    // For now, return empty array - can be implemented based on GR data
    return [];
  }

  @Get('vat-report/summary')
  async getVatSummary(@Query('year') year: number, @Query('month') month: number) {
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

  // ==========================================
  // FIXED ASSETS (สินทรัพย์ถาวร)
  // ==========================================

  @Get('fixed-assets')
  async getFixedAssets(
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    return this.fixedAssetRepo.find({
      where,
      relations: ['depreciationHistory'],
      order: { assetCode: 'ASC' },
    });
  }

  @Get('fixed-assets/:id')
  async getFixedAssetById(@Param('id', ParseIntPipe) id: number) {
    return this.fixedAssetRepo.findOne({
      where: { id },
      relations: ['depreciationHistory'],
    });
  }

  @Post('fixed-assets')
  async createFixedAsset(@Body() data: any, @Request() req: any) {
    const asset = this.fixedAssetRepo.create({
      ...data,
      netBookValue: data.acquisitionCost,
      createdBy: req.user.sub,
    });
    return this.fixedAssetRepo.save(asset);
  }

  @Put('fixed-assets/:id')
  async updateFixedAsset(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    await this.fixedAssetRepo.update(id, data);
    return this.getFixedAssetById(id);
  }

  @Delete('fixed-assets/:id')
  async deleteFixedAsset(@Param('id', ParseIntPipe) id: number) {
    await this.fixedAssetRepo.delete(id);
    return { success: true };
  }

  @Post('fixed-assets/:id/dispose')
  async disposeFixedAsset(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { disposalDate: string; disposalAmount: number },
  ) {
    await this.fixedAssetRepo.update(id, {
      status: 'DISPOSED',
      disposalDate: new Date(data.disposalDate),
      disposalAmount: data.disposalAmount,
    });
    return this.getFixedAssetById(id);
  }

  @Post('fixed-assets/calculate-depreciation')
  async calculateDepreciation(@Body() data: { year: number; month: number }) {
    const { year, month } = data;

    const assets = await this.fixedAssetRepo.find({
      where: { status: 'ACTIVE' },
    });

    for (const asset of assets) {
      // Check if already calculated
      const existing = await this.depreciationRepo.findOne({
        where: { fixedAssetId: asset.id, year, month },
      });
      if (existing) continue;

      // Calculate monthly depreciation (Straight Line)
      const depreciableAmount = Number(asset.acquisitionCost) - Number(asset.salvageValue);
      const monthlyDepreciation = depreciableAmount / (asset.usefulLife * 12);

      const newAccumulated = Number(asset.accumulatedDepreciation) + monthlyDepreciation;
      const newNetBookValue = Number(asset.acquisitionCost) - newAccumulated;

      // Save depreciation history
      const history = this.depreciationRepo.create({
        fixedAssetId: asset.id,
        year,
        month,
        depreciationAmount: monthlyDepreciation,
        accumulatedDepreciation: newAccumulated,
        netBookValue: Math.max(newNetBookValue, Number(asset.salvageValue)),
      });
      await this.depreciationRepo.save(history);

      // Update asset
      const status = newNetBookValue <= Number(asset.salvageValue) ? 'FULLY_DEPRECIATED' : 'ACTIVE';
      await this.fixedAssetRepo.update(asset.id, {
        accumulatedDepreciation: newAccumulated,
        netBookValue: Math.max(newNetBookValue, Number(asset.salvageValue)),
        status,
      });
    }

    return { success: true, message: `Calculated depreciation for ${assets.length} assets` };
  }

  // ==========================================
  // CASH FLOW (งบกระแสเงินสด)
  // ==========================================

  @Get('cash-flow/statement')
  async getCashFlowStatement(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    // Get journal entries for the period
    const entries = await this.journalEntryRepo.find({
      where: {
        entryDate: Between(new Date(startDate), new Date(endDate)),
        status: 'POSTED',
      },
      relations: ['lines', 'lines.account'],
    });

    // Initialize cash flow sections
    const operatingItems: any[] = [];
    const investingItems: any[] = [];
    const financingItems: any[] = [];

    // Calculate based on account types
    let netCashFromOperating = 0;
    let netCashFromInvesting = 0;
    let netCashFromFinancing = 0;

    // Operating Activities
    operatingItems.push({ description: 'กำไรสุทธิ', amount: 0, isSubtotal: false });
    operatingItems.push({ description: 'ค่าเสื่อมราคา', amount: 0, isSubtotal: false });
    operatingItems.push({ description: 'การเปลี่ยนแปลงในลูกหนี้', amount: 0, isSubtotal: false });
    operatingItems.push({ description: 'การเปลี่ยนแปลงในสินค้าคงเหลือ', amount: 0, isSubtotal: false });
    operatingItems.push({ description: 'การเปลี่ยนแปลงในเจ้าหนี้', amount: 0, isSubtotal: false });

    // Investing Activities
    investingItems.push({ description: 'ซื้อสินทรัพย์ถาวร', amount: 0, isSubtotal: false });
    investingItems.push({ description: 'ขายสินทรัพย์ถาวร', amount: 0, isSubtotal: false });

    // Financing Activities
    financingItems.push({ description: 'เงินกู้ยืม', amount: 0, isSubtotal: false });
    financingItems.push({ description: 'ชำระคืนเงินกู้', amount: 0, isSubtotal: false });
    financingItems.push({ description: 'จ่ายเงินปันผล', amount: 0, isSubtotal: false });

    // Calculate beginning and ending cash
    const beginningCash = 0; // Should be calculated from opening balance
    const netChangeInCash = netCashFromOperating + netCashFromInvesting + netCashFromFinancing;
    const endingCash = beginningCash + netChangeInCash;

    return {
      period: { startDate, endDate },
      operatingActivities: {
        items: operatingItems,
        total: netCashFromOperating,
      },
      investingActivities: {
        items: investingItems,
        total: netCashFromInvesting,
      },
      financingActivities: {
        items: financingItems,
        total: netCashFromFinancing,
      },
      summary: {
        netCashFromOperating,
        netCashFromInvesting,
        netCashFromFinancing,
        netChangeInCash,
        beginningCash,
        endingCash,
      },
    };
  }
}
