import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FifoLayerEntity, FifoTransactionEntity, StockBalanceEntity } from './entities';
import { FifoService } from './fifo.service';
import { FifoController } from './fifo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FifoLayerEntity, FifoTransactionEntity, StockBalanceEntity])],
  controllers: [FifoController],
  providers: [FifoService],
  exports: [FifoService],
})
export class FifoModule {}
