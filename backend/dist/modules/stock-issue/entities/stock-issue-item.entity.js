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
exports.StockIssueItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_issue_entity_1 = require("./stock-issue.entity");
let StockIssueItemEntity = class StockIssueItemEntity {
};
exports.StockIssueItemEntity = StockIssueItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockIssueItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_issue_id' }),
    __metadata("design:type", Number)
], StockIssueItemEntity.prototype, "stockIssueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_no' }),
    __metadata("design:type", Number)
], StockIssueItemEntity.prototype, "lineNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], StockIssueItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 4 }),
    __metadata("design:type", Number)
], StockIssueItemEntity.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockIssueItemEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'line_total', type: 'decimal', precision: 15, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], StockIssueItemEntity.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_issue_entity_1.StockIssueEntity, issue => issue.items),
    (0, typeorm_1.JoinColumn)({ name: 'stock_issue_id' }),
    __metadata("design:type", stock_issue_entity_1.StockIssueEntity)
], StockIssueItemEntity.prototype, "stockIssue", void 0);
exports.StockIssueItemEntity = StockIssueItemEntity = __decorate([
    (0, typeorm_1.Entity)('stock_issue_items')
], StockIssueItemEntity);
//# sourceMappingURL=stock-issue-item.entity.js.map