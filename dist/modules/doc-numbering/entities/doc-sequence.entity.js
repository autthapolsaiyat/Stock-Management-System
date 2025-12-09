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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocSequenceEntity = void 0;
const typeorm_1 = require("typeorm");
let DocSequenceEntity = class DocSequenceEntity {
};
exports.DocSequenceEntity = DocSequenceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DocSequenceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], DocSequenceEntity.prototype, "docType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'year_month', type: 'varchar', length: 4 }),
    __metadata("design:type", String)
], DocSequenceEntity.prototype, "yearMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_number', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DocSequenceEntity.prototype, "lastNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prefix', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], DocSequenceEntity.prototype, "prefix", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DocSequenceEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], DocSequenceEntity.prototype, "updatedAt", void 0);
exports.DocSequenceEntity = DocSequenceEntity = __decorate([
    (0, typeorm_1.Entity)('doc_sequences'),
    (0, typeorm_1.Unique)(['docType', 'yearMonth'])
], DocSequenceEntity);
//# sourceMappingURL=doc-sequence.entity.js.map