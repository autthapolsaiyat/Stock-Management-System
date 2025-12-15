"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const purchase_order_service_1 = require("./purchase-order.service");
const purchase_order_controller_1 = require("./purchase-order.controller");
const doc_numbering_module_1 = require("../doc-numbering/doc-numbering.module");
const quotation_module_1 = require("../quotation/quotation.module");
let PurchaseOrderModule = class PurchaseOrderModule {
};
exports.PurchaseOrderModule = PurchaseOrderModule;
exports.PurchaseOrderModule = PurchaseOrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.PurchaseOrderEntity, entities_1.PurchaseOrderItemEntity]),
            doc_numbering_module_1.DocNumberingModule,
            (0, common_1.forwardRef)(() => quotation_module_1.QuotationModule),
        ],
        controllers: [purchase_order_controller_1.PurchaseOrderController],
        providers: [purchase_order_service_1.PurchaseOrderService],
        exports: [purchase_order_service_1.PurchaseOrderService],
    })
], PurchaseOrderModule);
//# sourceMappingURL=purchase-order.module.js.map