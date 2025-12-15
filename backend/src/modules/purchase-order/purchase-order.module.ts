import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderEntity, PurchaseOrderItemEntity } from './entities';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { QuotationModule } from '../quotation/quotation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrderEntity, PurchaseOrderItemEntity]),
    DocNumberingModule,
    forwardRef(() => QuotationModule),
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
