"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const health_module_1 = require("./modules/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const product_module_1 = require("./modules/product/product.module");
const customer_module_1 = require("./modules/customer/customer.module");
const supplier_module_1 = require("./modules/supplier/supplier.module");
const warehouse_module_1 = require("./modules/warehouse/warehouse.module");
const doc_numbering_module_1 = require("./modules/doc-numbering/doc-numbering.module");
const fifo_module_1 = require("./modules/fifo/fifo.module");
const quotation_module_1 = require("./modules/quotation/quotation.module");
const purchase_order_module_1 = require("./modules/purchase-order/purchase-order.module");
const goods_receipt_module_1 = require("./modules/goods-receipt/goods-receipt.module");
const stock_issue_module_1 = require("./modules/stock-issue/stock-issue.module");
const stock_transfer_module_1 = require("./modules/stock-transfer/stock-transfer.module");
const sales_invoice_module_1 = require("./modules/sales-invoice/sales-invoice.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
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
                inject: [config_1.ConfigService],
            }),
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            product_module_1.ProductModule,
            customer_module_1.CustomerModule,
            supplier_module_1.SupplierModule,
            warehouse_module_1.WarehouseModule,
            doc_numbering_module_1.DocNumberingModule,
            fifo_module_1.FifoModule,
            quotation_module_1.QuotationModule,
            purchase_order_module_1.PurchaseOrderModule,
            goods_receipt_module_1.GoodsReceiptModule,
            stock_issue_module_1.StockIssueModule,
            stock_transfer_module_1.StockTransferModule,
            sales_invoice_module_1.SalesInvoiceModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map