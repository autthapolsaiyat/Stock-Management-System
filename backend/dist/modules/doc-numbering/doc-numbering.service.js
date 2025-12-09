"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocNumberingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doc_sequence_entity_1 = require("./entities/doc-sequence.entity");
let DocNumberingService = class DocNumberingService {
    constructor(seqRepository) {
        this.seqRepository = seqRepository;
    }
    async generateDocNumber(docType, queryRunner) {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const yearMonth = `${year}${month}`;
        const repo = queryRunner ? queryRunner.manager.getRepository(doc_sequence_entity_1.DocSequenceEntity) : this.seqRepository;
        let seq = await repo.findOne({ where: { docType, yearMonth } });
        if (!seq) {
            seq = repo.create({ docType, yearMonth, lastNumber: 0, prefix: docType });
            await repo.save(seq);
        }
        seq.lastNumber += 1;
        await repo.save(seq);
        const docBaseNo = `${docType}${yearMonth}${String(seq.lastNumber).padStart(4, '0')}`;
        const docFullNo = docBaseNo;
        return { docNo: docBaseNo, docBaseNo, docFullNo };
    }
};
exports.DocNumberingService = DocNumberingService;
exports.DocNumberingService = DocNumberingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doc_sequence_entity_1.DocSequenceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocNumberingService);
//# sourceMappingURL=doc-numbering.service.js.map