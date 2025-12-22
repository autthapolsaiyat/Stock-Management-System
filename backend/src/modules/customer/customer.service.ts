import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async findAll(groupId?: number) {
    const query = this.customerRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.group', 'group')
      .where('customer.isActive = :isActive', { isActive: true });
    
    if (groupId) {
      query.andWhere('customer.groupId = :groupId', { groupId });
    }
    
    query.orderBy('customer.code', 'ASC');
    
    return query.getMany();
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({ 
      where: { id },
      relations: ['group']
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(dto: any) {
    const customer = this.customerRepository.create({ ...dto, isActive: true });
    return this.customerRepository.save(customer);
  }

  async update(id: number, dto: any) {
    const customer = await this.findOne(id);
    Object.assign(customer, dto);
    return this.customerRepository.save(customer);
  }

  async updateGroup(id: number, groupId: number) {
    await this.customerRepository.update(id, { groupId });
    return this.findOne(id);
  }

  async findByGroup(groupId: number) {
    return this.customerRepository.find({
      where: { groupId, isActive: true },
      relations: ['group'],
      order: { code: 'ASC' }
    });
  }
}
