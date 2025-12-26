import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// Services
import { ChartOfAccountService } from './services/chart-of-account.service';
import { JournalEntryService } from './services/journal-entry.service';
import { PaymentReceiptService } from './services/payment-receipt.service';
import { PaymentVoucherService } from './services/payment-voucher.service';
import { BankAccountService } from './services/bank-account.service';
import { ArApService } from './services/ar-ap.service';
import { ReportService } from './services/report.service';

// DTOs
import { CreateChartOfAccountDto, UpdateChartOfAccountDto } from './dto/chart-of-account.dto';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from './dto/journal-entry.dto';
import { CreatePaymentReceiptDto, CreatePaymentVoucherDto } from './dto/payment.dto';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto/bank-account.dto';

// Entities
import { AccountType, AccountGroup } from './entities/chart-of-account.entity';
import { JournalType, JournalStatus, ReferenceType } from './entities/journal-entry.entity';
import { PaymentStatus } from './entities/payment-receipt.entity';
import { OutstandingStatus } from './entities/ar-ap-outstanding.entity';

@ApiTags('Accounting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounting')
export class AccountingController {
  constructor(
    private readonly coaService: ChartOfAccountService,
    private readonly journalService: JournalEntryService,
    private readonly paymentReceiptService: PaymentReceiptService,
    private readonly paymentVoucherService: PaymentVoucherService,
    private readonly bankService: BankAccountService,
    private readonly arApService: ArApService,
    private readonly reportService: ReportService,
  ) {}

  // ==================== CHART OF ACCOUNTS ====================

  @Get('chart-of-accounts')
  @ApiOperation({ summary: 'Get all chart of accounts' })
  async getChartOfAccounts() {
    return this.coaService.findAll();
  }

  @Get('chart-of-accounts/tree')
  @ApiOperation({ summary: 'Get chart of accounts as tree structure' })
  async getChartOfAccountsTree() {
    return this.coaService.getAccountTree();
  }

  @Get('chart-of-accounts/type/:type')
  @ApiOperation({ summary: 'Get accounts by type' })
  async getAccountsByType(@Param('type') type: AccountType) {
    return this.coaService.findByType(type);
  }

  @Get('chart-of-accounts/:id')
  @ApiOperation({ summary: 'Get account by ID' })
  async getAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.coaService.findById(id);
  }

  @Post('chart-of-accounts')
  @ApiOperation({ summary: 'Create new account' })
  async createAccount(@Body() dto: CreateChartOfAccountDto, @CurrentUser() user: any) {
    return this.coaService.create(dto, user?.id);
  }

  @Put('chart-of-accounts/:id')
  @ApiOperation({ summary: 'Update account' })
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChartOfAccountDto,
    @CurrentUser() user: any,
  ) {
    return this.coaService.update(id, dto, user?.id);
  }

  @Delete('chart-of-accounts/:id')
  @ApiOperation({ summary: 'Delete account' })
  async deleteAccount(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    await this.coaService.delete(id, user?.id);
    return { message: 'Account deleted successfully' };
  }

  @Post('chart-of-accounts/initialize')
  @ApiOperation({ summary: 'Initialize default chart of accounts' })
  async initializeAccounts() {
    await this.coaService.initializeDefaultAccounts();
    return { message: 'Default accounts initialized successfully' };
  }

  // ==================== JOURNAL ENTRIES ====================

  @Get('journal-entries')
  @ApiOperation({ summary: 'Get all journal entries' })
  async getJournalEntries(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('journalType') journalType?: JournalType,
    @Query('status') status?: JournalStatus,
    @Query('referenceType') referenceType?: ReferenceType,
  ) {
    return this.journalService.findAll({ startDate, endDate, journalType, status, referenceType });
  }

  @Get('journal-entries/:id')
  @ApiOperation({ summary: 'Get journal entry by ID' })
  async getJournalEntryById(@Param('id', ParseIntPipe) id: number) {
    return this.journalService.findById(id);
  }

  @Post('journal-entries')
  @ApiOperation({ summary: 'Create new journal entry' })
  async createJournalEntry(@Body() dto: CreateJournalEntryDto, @CurrentUser() user: any) {
    return this.journalService.create(dto, user?.id);
  }

  @Put('journal-entries/:id')
  @ApiOperation({ summary: 'Update journal entry' })
  async updateJournalEntry(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJournalEntryDto,
    @CurrentUser() user: any,
  ) {
    return this.journalService.update(id, dto, user?.id);
  }

  @Post('journal-entries/:id/post')
  @ApiOperation({ summary: 'Post journal entry' })
  async postJournalEntry(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.journalService.post(id, user?.id);
  }

  @Post('journal-entries/:id/cancel')
  @ApiOperation({ summary: 'Cancel journal entry' })
  async cancelJournalEntry(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.journalService.cancel(id, reason, user?.id);
  }

  @Post('journal-entries/:id/reverse')
  @ApiOperation({ summary: 'Reverse journal entry' })
  async reverseJournalEntry(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.journalService.reverse(id, user?.id);
  }

  @Delete('journal-entries/:id')
  @ApiOperation({ summary: 'Delete draft journal entry' })
  async deleteJournalEntry(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    await this.journalService.delete(id, user?.id);
    return { message: 'Journal entry deleted successfully' };
  }

  // ==================== PAYMENT RECEIPTS ====================

  @Get('payment-receipts')
  @ApiOperation({ summary: 'Get all payment receipts' })
  async getPaymentReceipts(
    @Query('customerId') customerId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.paymentReceiptService.findAll({ customerId, startDate, endDate, status });
  }

  @Get('payment-receipts/:id')
  @ApiOperation({ summary: 'Get payment receipt by ID' })
  async getPaymentReceiptById(@Param('id', ParseIntPipe) id: number) {
    return this.paymentReceiptService.findById(id);
  }

  @Get('payment-receipts/customer/:customerId/outstanding')
  @ApiOperation({ summary: 'Get customer outstanding invoices' })
  async getCustomerOutstanding(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.paymentReceiptService.getCustomerOutstanding(customerId);
  }

  @Post('payment-receipts')
  @ApiOperation({ summary: 'Create payment receipt' })
  async createPaymentReceipt(@Body() dto: CreatePaymentReceiptDto, @CurrentUser() user: any) {
    return this.paymentReceiptService.create(dto, user?.id);
  }

  @Post('payment-receipts/:id/post')
  @ApiOperation({ summary: 'Post payment receipt' })
  async postPaymentReceipt(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.paymentReceiptService.post(id, user?.id);
  }

  @Post('payment-receipts/:id/cancel')
  @ApiOperation({ summary: 'Cancel payment receipt' })
  async cancelPaymentReceipt(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentReceiptService.cancel(id, reason, user?.id);
  }

  @Delete('payment-receipts/:id')
  @ApiOperation({ summary: 'Delete draft payment receipt' })
  async deletePaymentReceipt(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    await this.paymentReceiptService.delete(id, user?.id);
    return { message: 'Payment receipt deleted successfully' };
  }

  // ==================== PAYMENT VOUCHERS ====================

  @Get('payment-vouchers')
  @ApiOperation({ summary: 'Get all payment vouchers' })
  async getPaymentVouchers(
    @Query('supplierId') supplierId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.paymentVoucherService.findAll({ supplierId, startDate, endDate, status });
  }

  @Get('payment-vouchers/:id')
  @ApiOperation({ summary: 'Get payment voucher by ID' })
  async getPaymentVoucherById(@Param('id', ParseIntPipe) id: number) {
    return this.paymentVoucherService.findById(id);
  }

  @Get('payment-vouchers/supplier/:supplierId/outstanding')
  @ApiOperation({ summary: 'Get supplier outstanding' })
  async getSupplierOutstanding(@Param('supplierId', ParseIntPipe) supplierId: number) {
    return this.paymentVoucherService.getSupplierOutstanding(supplierId);
  }

  @Post('payment-vouchers')
  @ApiOperation({ summary: 'Create payment voucher' })
  async createPaymentVoucher(@Body() dto: CreatePaymentVoucherDto, @CurrentUser() user: any) {
    return this.paymentVoucherService.create(dto, user?.id);
  }

  @Post('payment-vouchers/:id/post')
  @ApiOperation({ summary: 'Post payment voucher' })
  async postPaymentVoucher(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.paymentVoucherService.post(id, user?.id);
  }

  @Post('payment-vouchers/:id/cancel')
  @ApiOperation({ summary: 'Cancel payment voucher' })
  async cancelPaymentVoucher(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentVoucherService.cancel(id, reason, user?.id);
  }

  @Delete('payment-vouchers/:id')
  @ApiOperation({ summary: 'Delete draft payment voucher' })
  async deletePaymentVoucher(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    await this.paymentVoucherService.delete(id, user?.id);
    return { message: 'Payment voucher deleted successfully' };
  }

  // ==================== BANK ACCOUNTS ====================

  @Get('bank-accounts')
  @ApiOperation({ summary: 'Get all bank accounts' })
  async getBankAccounts() {
    return this.bankService.findAll();
  }

  @Get('bank-accounts/:id')
  @ApiOperation({ summary: 'Get bank account by ID' })
  async getBankAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.bankService.findById(id);
  }

  @Post('bank-accounts')
  @ApiOperation({ summary: 'Create bank account' })
  async createBankAccount(@Body() dto: CreateBankAccountDto, @CurrentUser() user: any) {
    return this.bankService.create(dto, user?.id);
  }

  @Put('bank-accounts/:id')
  @ApiOperation({ summary: 'Update bank account' })
  async updateBankAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBankAccountDto,
    @CurrentUser() user: any,
  ) {
    return this.bankService.update(id, dto, user?.id);
  }

  @Delete('bank-accounts/:id')
  @ApiOperation({ summary: 'Delete bank account' })
  async deleteBankAccount(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    await this.bankService.delete(id, user?.id);
    return { message: 'Bank account deleted successfully' };
  }

  // ==================== AR/AP ====================

  @Get('ar/outstanding')
  @ApiOperation({ summary: 'Get AR outstanding' })
  async getAROutstanding(
    @Query('customerId') customerId?: number,
    @Query('status') status?: OutstandingStatus,
  ) {
    return this.arApService.getAROutstanding({ customerId, status });
  }

  @Get('ar/aging')
  @ApiOperation({ summary: 'Get AR aging report' })
  async getARAgingReport(@Query('asOfDate') asOfDate: string) {
    return this.arApService.getARAgingReport(asOfDate || new Date().toISOString().split('T')[0]);
  }

  @Get('ar/summary')
  @ApiOperation({ summary: 'Get AR summary by customer' })
  async getARSummary() {
    return this.arApService.getARSummaryByCustomer();
  }

  @Get('ap/outstanding')
  @ApiOperation({ summary: 'Get AP outstanding' })
  async getAPOutstanding(
    @Query('supplierId') supplierId?: number,
    @Query('status') status?: OutstandingStatus,
  ) {
    return this.arApService.getAPOutstanding({ supplierId, status });
  }

  @Get('ap/aging')
  @ApiOperation({ summary: 'Get AP aging report' })
  async getAPAgingReport(@Query('asOfDate') asOfDate: string) {
    return this.arApService.getAPAgingReport(asOfDate || new Date().toISOString().split('T')[0]);
  }

  @Get('ap/summary')
  @ApiOperation({ summary: 'Get AP summary by supplier' })
  async getAPSummary() {
    return this.arApService.getAPSummaryBySupplier();
  }

  @Get('ar-ap/dashboard')
  @ApiOperation({ summary: 'Get AR/AP dashboard summary' })
  async getARAPDashboard() {
    return this.arApService.getDashboardSummary();
  }

  // ==================== FINANCIAL REPORTS ====================

  @Get('reports/trial-balance')
  @ApiOperation({ summary: 'Get trial balance report' })
  async getTrialBalance(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('showZeroBalance') showZeroBalance?: string,
  ) {
    return this.reportService.getTrialBalance({
      startDate,
      endDate,
      showZeroBalance: showZeroBalance === 'true',
    });
  }

  @Get('reports/profit-loss')
  @ApiOperation({ summary: 'Get profit & loss report' })
  async getProfitAndLoss(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getProfitAndLoss({ startDate, endDate });
  }

  @Get('reports/balance-sheet')
  @ApiOperation({ summary: 'Get balance sheet report' })
  async getBalanceSheet(@Query('asOfDate') asOfDate: string) {
    return this.reportService.getBalanceSheet({
      asOfDate: asOfDate || new Date().toISOString().split('T')[0],
    });
  }

  @Get('reports/general-ledger/:accountId')
  @ApiOperation({ summary: 'Get general ledger for account' })
  async getGeneralLedger(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getGeneralLedger({ accountId, startDate, endDate });
  }

  @Get('reports/financial-summary')
  @ApiOperation({ summary: 'Get financial summary for dashboard' })
  async getFinancialSummary(@Query('year') year?: string) {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    return this.reportService.getFinancialSummary(targetYear);
  }
}
