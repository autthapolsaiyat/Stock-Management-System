"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FifoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const fifo_service_1 = require("./fifo.service");
const fifo_controller_1 = require("./fifo.controller");
let FifoModule = class FifoModule {
};
exports.FifoModule = FifoModule;
exports.FifoModule = FifoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.FifoLayerEntity, entities_1.FifoTransactionEntity, entities_1.StockBalanceEntity])],
        controllers: [fifo_controller_1.FifoController],
        providers: [fifo_service_1.FifoService],
        exports: [fifo_service_1.FifoService],
    })
], FifoModule);
//# sourceMappingURL=fifo.module.js.map