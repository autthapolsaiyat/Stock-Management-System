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
exports.StockIssueEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_issue_item_entity_1 = require("./stock-issue-item.entity");
let StockIssueEntity = class StockIssueEntity {
};
exports.StockIssueEntity = StockIssueEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockIssueEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_base_no', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], StockIssueEntity.prototype, "docBaseNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_revision', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], StockIssueEntity.prototype, "docRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_full_no', type: 'varchar', length: 25, unique: true }),
    __metadata("design:type", String)
], StockIssueEntity.prototype, "docFullNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_latest_revision', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], StockIssueEntity.prototype, "isLatestRevision", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], StockIssueEntity.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doc_date', type: 'date' }),
    __metadata("design:type", Date)
], StockIssueEntity.prototype, "docDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StockIssueEntity.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'DRAFT' }),
    __metadata("design:type", String)
], StockIssueEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockIssueEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockIssueEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'posted_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockIssueEntity.prototype, "postedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'posted_by', nullable: true }),
    __metadata("design:type", Number)
], StockIssueEntity.prototype, "postedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], StockIssueEntity.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_by', nullable: true }),
    __metadata("design:type", Number)
], StockIssueEntity.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockIssueEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StockIssueEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], StockIssueEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', nullable: true }),
    __metadata("design:type", Number)
], StockIssueEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_issue_item_entity_1.StockIssueItemEntity, item => item.stockIssue),
    __metadata("design:type", Array)
], StockIssueEntity.prototype, "items", void 0);
exports.StockIssueEntity = StockIssueEntity = __decorate([
    (0, typeorm_1.Entity)('stock_issues')
], StockIssueEntity);
//# sourceMappingURL=stock-issue.entity.js.map