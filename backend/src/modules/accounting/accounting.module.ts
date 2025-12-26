import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  ChartOfAccountEntity,
  JournalEntryEntity,
  JournalEntryLineEntity,
  PaymentReceiptEntity,
  PaymentReceiptItemEntity,
  PaymentVoucherEntity,
  PaymentVoucherItemEntity,
  BankAccountEntity,
  ArApOutstandingEntity,
  FiscalPeriodEntity,
  TaxInvoiceEntity,
  TaxInvoiceLineEntity,
  WithholdingTaxEntity,
  FixedAssetEntity,
  DepreciationHistoryEntity,
} from './entities';

// Services
import {
  ChartOfAccountService,
  JournalEntryService,
  PaymentReceiptService,
  PaymentVoucherService,
  BankAccountService,
  ArApService,
  ReportService,
} from './services';
import { TaxService } from './services/tax.service';

// Controller
import { AccountingController } from './accounting.controller';

// Other modules
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChartOfAccountEntity,
      JournalEntryEntity,
      JournalEntryLineEntity,
      PaymentReceiptEntity,
      PaymentReceiptItemEntity,
      PaymentVoucherEntity,
      PaymentVoucherItemEntity,
      BankAccountEntity,
      ArApOutstandingEntity,
      FiscalPeriodEntity,
      TaxInvoiceEntity,
      TaxInvoiceLineEntity,
      WithholdingTaxEntity,
      FixedAssetEntity,
      DepreciationHistoryEntity,
    ]),
    DocNumberingModule,
  ],
  controllers: [AccountingController],
  providers: [
    ChartOfAccountService,
    JournalEntryService,
    PaymentReceiptService,
    PaymentVoucherService,
    BankAccountService,
    ArApService,
    ReportService,
    TaxService,
  ],
  exports: [
    ChartOfAccountService,
    JournalEntryService,
    PaymentReceiptService,
    PaymentVoucherService,
    BankAccountService,
    ArApService,
    ReportService,
    TaxService,
  ],
})
export class AccountingModule {}
