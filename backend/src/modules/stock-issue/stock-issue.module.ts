import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockIssueEntity, StockIssueItemEntity } from './entities';
import { StockIssueService } from './stock-issue.service';
import { StockIssueController } from './stock-issue.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { FifoModule } from '../fifo/fifo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockIssueEntity, StockIssueItemEntity]),
    DocNumberingModule,
    FifoModule,
  ],
  controllers: [StockIssueController],
  providers: [StockIssueService],
})
export class StockIssueModule {}
