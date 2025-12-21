import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierEntity } from './entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
  ) {}

  async findAll() {
    return this.supplierRepository.find({ where: { isActive: true }, order: { code: 'ASC' } });
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id }, relations: ['contacts'] });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async create(dto: any) {
    const supplier = this.supplierRepository.create({ ...dto, isActive: true });
    return this.supplierRepository.save(supplier);
  }

  async update(id: number, dto: any) {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return this.supplierRepository.save(supplier);
  }

  async delete(id: number) {
    const supplier = await this.findOne(id);
    supplier.isActive = false;
    return this.supplierRepository.save(supplier);
  }
}
