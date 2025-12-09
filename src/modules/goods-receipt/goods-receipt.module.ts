import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsReceiptEntity, GoodsReceiptItemEntity } from './entities';
import { GoodsReceiptService } from './goods-receipt.service';
import { GoodsReceiptController } from './goods-receipt.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { FifoModule } from '../fifo/fifo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoodsReceiptEntity, GoodsReceiptItemEntity]),
    DocNumberingModule,
    FifoModule,
  ],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService],
  exports: [GoodsReceiptService],
})
export class GoodsReceiptModule {}
