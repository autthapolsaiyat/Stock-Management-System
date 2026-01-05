import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationEntity, QuotationItemEntity } from './entities';
import { QuotationCalculatorEntity } from './entities/quotation-calculator.entity';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { QuotationCalculatorService } from './quotation-calculator.service';
import { QuotationCalculatorController } from './quotation-calculator.controller';
import { DocNumberingModule } from '../doc-numbering/doc-numbering.module';
import { TempProductModule } from '../temp-product/temp-product.module';
import { SystemSettingsModule } from '../system-settings/system-settings.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationEntity, QuotationItemEntity, QuotationCalculatorEntity]),
    DocNumberingModule,
    TempProductModule,
    SystemSettingsModule,
    AuditLogModule,
  ],
  controllers: [QuotationController, QuotationCalculatorController],
  providers: [QuotationService, QuotationCalculatorService],
  exports: [QuotationService, QuotationCalculatorService],
})
export class QuotationModule {}
