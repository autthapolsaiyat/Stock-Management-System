import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './common/common.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CustomerModule } from './modules/customer/customer.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { DocNumberingModule } from './modules/doc-numbering/doc-numbering.module';
import { FifoModule } from './modules/fifo/fifo.module';
import { SystemSettingsModule } from './modules/system-settings/system-settings.module';
import { TempProductModule } from './modules/temp-product/temp-product.module';
import { QuotationModule } from './modules/quotation/quotation.module';
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { GoodsReceiptModule } from './modules/goods-receipt/goods-receipt.module';
import { StockIssueModule } from './modules/stock-issue/stock-issue.module';
import { StockTransferModule } from './modules/stock-transfer/stock-transfer.module';
import { SalesInvoiceModule } from './modules/sales-invoice/sales-invoice.module';
import { UploadModule } from './upload/upload.module';
import { UserSettingsModule } from './modules/user-settings/user-settings.module';
import { VCardModule } from './modules/vcard/vcard.module';
import { CategoryModule } from './modules/category/category.module';
import { CustomerGroupModule } from './modules/customer-group/customer-group.module';
import { StockAdjustmentModule } from './modules/stock-adjustment/stock-adjustment.module';
import { StockCountModule } from './modules/stock-count/stock-count.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AccountingModule } from './modules/accounting/accounting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'svs_stock'),
        ssl: configService.get('DB_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    HealthModule,
    AuthModule,
    UserModule,
    ProductModule,
    CustomerModule,
    SupplierModule,
    WarehouseModule,
    DocNumberingModule,
    FifoModule,
    SystemSettingsModule,
    TempProductModule,
    QuotationModule,
    PurchaseOrderModule,
    GoodsReceiptModule,
    StockIssueModule,
    StockTransferModule,
    SalesInvoiceModule,
    UploadModule,
    UserSettingsModule,
    VCardModule,
    CategoryModule,
    CustomerGroupModule,
    StockAdjustmentModule,
    StockCountModule,
    AuditLogModule,
    AccountingModule,
  ],
})
export class AppModule {}