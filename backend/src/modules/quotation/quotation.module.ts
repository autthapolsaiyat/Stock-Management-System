import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationEntity, QuotationItemEntity } from './entities';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationEntity, QuotationItemEntity]),
    DocNumberingModule,
  ],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
