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

  async findAll() {
    return this.customerRepository.find({ 
      where: { isActive: true },
      order: { code: 'ASC' } 
    });
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({ 
      where: { id }
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

  async delete(id: number) {
    const customer = await this.findOne(id);
    customer.isActive = false;
    return this.customerRepository.save(customer);
  }
}
