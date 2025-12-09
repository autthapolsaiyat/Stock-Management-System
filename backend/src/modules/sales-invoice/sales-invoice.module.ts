import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesInvoiceEntity, SalesInvoiceItemEntity } from './entities';
import { SalesInvoiceService } from './sales-invoice.service';
import { SalesInvoiceController } from './sales-invoice.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { FifoModule } from '../fifo/fifo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesInvoiceEntity, SalesInvoiceItemEntity]),
    DocNumberingModule,
    FifoModule,
  ],
  controllers: [SalesInvoiceController],
  providers: [SalesInvoiceService],
})
export class SalesInvoiceModule {}
