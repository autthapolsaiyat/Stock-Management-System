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
  ],
  exports: [
    ChartOfAccountService,
    JournalEntryService,
    PaymentReceiptService,
    PaymentVoucherService,
    BankAccountService,
    ArApService,
    ReportService,
  ],
})
export class AccountingModule {}
