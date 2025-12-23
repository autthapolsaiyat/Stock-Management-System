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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
let CustomerService = class CustomerService {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async findAll(groupId) {
        const query = this.customerRepository.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.group', 'group')
            .where('customer.isActive = :isActive', { isActive: true });
        if (groupId) {
            query.andWhere('(customer.groupId = :groupId OR group.code = :genCode)', {
                groupId,
                genCode: 'GEN'
            });
        }
        query.orderBy('customer.code', 'ASC');
        return query.getMany();
    }
    async findOne(id) {
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: ['group']
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async create(dto) {
        const customer = this.customerRepository.create({ ...dto, isActive: true });
        return this.customerRepository.save(customer);
    }
    async update(id, dto) {
        const customer = await this.findOne(id);
        Object.assign(customer, dto);
        return this.customerRepository.save(customer);
    }
    async updateGroup(id, groupId) {
        await this.customerRepository.update(id, { groupId });
        return this.findOne(id);
    }
    async findByGroup(groupId) {
        return this.customerRepository.find({
            where: { groupId, isActive: true },
            relations: ['group'],
            order: { code: 'ASC' }
        });
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.CustomerEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerService);
//# sourceMappingURL=customer.service.js.map