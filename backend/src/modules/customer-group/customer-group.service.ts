import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerGroupEntity } from './entities/customer-group.entity';

@Injectable()
export class CustomerGroupService {
  constructor(
    @InjectRepository(CustomerGroupEntity)
    private readonly customerGroupRepository: Repository<CustomerGroupEntity>,
  ) {}

  async findAll(): Promise<CustomerGroupEntity[]> {
    return this.customerGroupRepository.find({
      where: { isActive: true },
      order: { code: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CustomerGroupEntity> {
    return this.customerGroupRepository.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<CustomerGroupEntity> {
    return this.customerGroupRepository.findOne({ where: { code } });
  }

  async create(data: Partial<CustomerGroupEntity>): Promise<CustomerGroupEntity> {
    const entity = this.customerGroupRepository.create(data);
    return this.customerGroupRepository.save(entity);
  }

  async update(id: number, data: Partial<CustomerGroupEntity>): Promise<CustomerGroupEntity> {
    await this.customerGroupRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.customerGroupRepository.update(id, { isActive: false });
  }
}
