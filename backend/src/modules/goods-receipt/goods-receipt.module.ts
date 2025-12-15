import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsReceiptEntity, GoodsReceiptItemEntity } from './entities';
import { GoodsReceiptService } from './goods-receipt.service';
import { GoodsReceiptController } from './goods-receipt.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { FifoModule } from '../fifo/fifo.module';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { TempProductModule } from '../temp-product/temp-product.module';
import { SystemSettingsModule } from '../system-settings/system-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoodsReceiptEntity, GoodsReceiptItemEntity]),
    DocNumberingModule,
    FifoModule,
    forwardRef(() => PurchaseOrderModule),
    TempProductModule,
    SystemSettingsModule,
  ],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService],
  exports: [GoodsReceiptService],
})
export class GoodsReceiptModule {}
