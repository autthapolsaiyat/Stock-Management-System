import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxAccountingController } from './tax-accounting.controller';
import { TaxInvoice, TaxInvoiceLine } from './entities/tax-invoice.entity';
import { WithholdingTax } from './entities/withholding-tax.entity';
import { FixedAsset, DepreciationHistory } from './entities/fixed-asset.entity';
import { JournalEntry, JournalEntryLine } from './entities/journal-entry.entity';
import { ChartOfAccount } from './entities/chart-of-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaxInvoice,
      TaxInvoiceLine,
      WithholdingTax,
      FixedAsset,
      DepreciationHistory,
      JournalEntry,
      JournalEntryLine,
      ChartOfAccount,
    ]),
  ],
  controllers: [TaxAccountingController],
})
export class TaxAccountingModule {}
