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
exports.SupplierContactEntity = void 0;
const typeorm_1 = require("typeorm");
const supplier_entity_1 = require("./supplier.entity");
let SupplierContactEntity = class SupplierContactEntity {
};
exports.SupplierContactEntity = SupplierContactEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SupplierContactEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", Number)
], SupplierContactEntity.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], SupplierContactEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], SupplierContactEntity.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], SupplierContactEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], SupplierContactEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_primary', default: false }),
    __metadata("design:type", Boolean)
], SupplierContactEntity.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.SupplierEntity, supplier => supplier.contacts),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.SupplierEntity)
], SupplierContactEntity.prototype, "supplier", void 0);
exports.SupplierContactEntity = SupplierContactEntity = __decorate([
    (0, typeorm_1.Entity)('supplier_contacts')
], SupplierContactEntity);
//# sourceMappingURL=supplier-contact.entity.js.map