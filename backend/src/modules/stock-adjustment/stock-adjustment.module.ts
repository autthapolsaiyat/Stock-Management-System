import { Module } from '@nestjs/common';
import { StockAdjustmentController } from './stock-adjustment.controller';
import { StockAdjustmentService } from './stock-adjustment.service';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { FifoModule } from '../fifo/fifo.module';

@Module({
  imports: [DocNumberingModule, FifoModule],
  controllers: [StockAdjustmentController],
  providers: [StockAdjustmentService],
  exports: [StockAdjustmentService],
})
export class StockAdjustmentModule {}
