import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransferEntity, StockTransferItemEntity } from './entities';
import { StockTransferService } from './stock-transfer.service';
import { StockTransferController } from './stock-transfer.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { FifoModule } from '../fifo/fifo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockTransferEntity, StockTransferItemEntity]),
    DocNumberingModule,
    FifoModule,
  ],
  controllers: [StockTransferController],
  providers: [StockTransferService],
})
export class StockTransferModule {}
