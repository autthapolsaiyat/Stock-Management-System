"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesInvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const sales_invoice_service_1 = require("./sales-invoice.service");
const sales_invoice_controller_1 = require("./sales-invoice.controller");
const doc_numbering_module_1 = require("../doc-numbering/doc-numbering.module");
const fifo_module_1 = require("../fifo/fifo.module");
const quotation_module_1 = require("../quotation/quotation.module");
const system_settings_module_1 = require("../system-settings/system-settings.module");
let SalesInvoiceModule = class SalesInvoiceModule {
};
exports.SalesInvoiceModule = SalesInvoiceModule;
exports.SalesInvoiceModule = SalesInvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.SalesInvoiceEntity, entities_1.SalesInvoiceItemEntity]),
            doc_numbering_module_1.DocNumberingModule,
            fifo_module_1.FifoModule,
            (0, common_1.forwardRef)(() => quotation_module_1.QuotationModule),
            system_settings_module_1.SystemSettingsModule,
        ],
        controllers: [sales_invoice_controller_1.SalesInvoiceController],
        providers: [sales_invoice_service_1.SalesInvoiceService],
        exports: [sales_invoice_service_1.SalesInvoiceService],
    })
], SalesInvoiceModule);
//# sourceMappingURL=sales-invoice.module.js.map