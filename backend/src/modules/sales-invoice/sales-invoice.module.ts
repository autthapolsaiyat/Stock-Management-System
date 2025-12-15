import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesInvoiceEntity, SalesInvoiceItemEntity } from './entities';
import { SalesInvoiceService } from './sales-invoice.service';
import { SalesInvoiceController } from './sales-invoice.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { FifoModule } from '../fifo/fifo.module';
import { QuotationModule } from '../quotation/quotation.module';
import { SystemSettingsModule } from '../system-settings/system-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesInvoiceEntity, SalesInvoiceItemEntity]),
    DocNumberingModule,
    FifoModule,
    forwardRef(() => QuotationModule),
    SystemSettingsModule,
  ],
  controllers: [SalesInvoiceController],
  providers: [SalesInvoiceService],
  exports: [SalesInvoiceService],
})
export class SalesInvoiceModule {}
