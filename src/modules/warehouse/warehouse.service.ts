import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseEntity } from './entities/warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private warehouseRepository: Repository<WarehouseEntity>,
  ) {}

  async findAll() {
    return this.warehouseRepository.find({ order: { code: 'ASC' } });
  }

  async findOne(id: number) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async create(dto: any) {
    const warehouse = this.warehouseRepository.create(dto);
    return this.warehouseRepository.save(warehouse);
  }

  async update(id: number, dto: any) {
    const warehouse = await this.findOne(id);
    Object.assign(warehouse, dto);
    return this.warehouseRepository.save(warehouse);
  }
}
