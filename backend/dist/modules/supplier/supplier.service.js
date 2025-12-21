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
exports.SupplierService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("./entities/supplier.entity");
let SupplierService = class SupplierService {
    constructor(supplierRepository) {
        this.supplierRepository = supplierRepository;
    }
    async findAll() {
        return this.supplierRepository.find({ where: { isActive: true }, order: { code: 'ASC' } });
    }
    async findOne(id) {
        const supplier = await this.supplierRepository.findOne({ where: { id }, relations: ['contacts'] });
        if (!supplier)
            throw new common_1.NotFoundException('Supplier not found');
        return supplier;
    }
    async create(dto) {
        const supplier = this.supplierRepository.create({ ...dto, isActive: true });
        return this.supplierRepository.save(supplier);
    }
    async update(id, dto) {
        const supplier = await this.findOne(id);
        Object.assign(supplier, dto);
        return this.supplierRepository.save(supplier);
    }
    async delete(id) {
        const supplier = await this.findOne(id);
        supplier.isActive = false;
        return this.supplierRepository.save(supplier);
    }
};
exports.SupplierService = SupplierService;
exports.SupplierService = SupplierService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.SupplierEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SupplierService);
//# sourceMappingURL=supplier.service.js.map