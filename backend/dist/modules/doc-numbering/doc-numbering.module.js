"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocNumberingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const doc_sequence_entity_1 = require("./entities/doc-sequence.entity");
const doc_numbering_service_1 = require("./doc-numbering.service");
let DocNumberingModule = class DocNumberingModule {
};
exports.DocNumberingModule = DocNumberingModule;
exports.DocNumberingModule = DocNumberingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([doc_sequence_entity_1.DocSequenceEntity])],
        providers: [doc_numbering_service_1.DocNumberingService],
        exports: [doc_numbering_service_1.DocNumberingService],
    })
], DocNumberingModule);
//# sourceMappingURL=doc-numbering.module.js.map