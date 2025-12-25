import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationEntity, QuotationItemEntity } from './entities';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { TempProductModule } from '../temp-product/temp-product.module';
import { SystemSettingsModule } from '../system-settings/system-settings.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationEntity, QuotationItemEntity]),
    DocNumberingModule,
    TempProductModule,
    SystemSettingsModule,
    AuditLogModule,
  ],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
