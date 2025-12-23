import { Module } from '@nestjs/common';
import { StockCountController } from './stock-count.controller';
import { StockCountService } from './stock-count.service';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { StockAdjustmentModule } from '../stock-adjustment/stock-adjustment.module';

@Module({
  imports: [DocNumberingModule, StockAdjustmentModule],
  controllers: [StockCountController],
  providers: [StockCountService],
  exports: [StockCountService],
})
export class StockCountModule {}
