"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockCountModule = void 0;
const common_1 = require("@nestjs/common");
const stock_count_controller_1 = require("./stock-count.controller");
const stock_count_service_1 = require("./stock-count.service");
const doc_numbering_module_1 = require("../doc-numbering/doc-numbering.module");
const stock_adjustment_module_1 = require("../stock-adjustment/stock-adjustment.module");
let StockCountModule = class StockCountModule {
};
exports.StockCountModule = StockCountModule;
exports.StockCountModule = StockCountModule = __decorate([
    (0, common_1.Module)({
        imports: [doc_numbering_module_1.DocNumberingModule, stock_adjustment_module_1.StockAdjustmentModule],
        controllers: [stock_count_controller_1.StockCountController],
        providers: [stock_count_service_1.StockCountService],
        exports: [stock_count_service_1.StockCountService],
    })
], StockCountModule);
//# sourceMappingURL=stock-count.module.js.map