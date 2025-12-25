import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface AuditContext {
  userId: number;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    private auditLogService: AuditLogService,
  ) {}

  async findAll(groupId?: number) {
    const query = this.customerRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.group', 'group')
      .where('customer.isActive = :isActive', { isActive: true });
    
    if (groupId) {
      // ดึงลูกค้ากลุ่มตัวเอง + GEN (ลูกค้าทั่วไป)
      query.andWhere('(customer.groupId = :groupId OR group.code = :genCode)', { 
        groupId, 
        genCode: 'GEN' 
      });
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

  async create(dto: any, ctx?: AuditContext) {
    const customer = this.customerRepository.create({ ...dto, isActive: true });
    const saved = await this.customerRepository.save(customer) as CustomerEntity;
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'CUSTOMER',
        action: 'CREATE',
        documentId: saved.id,
        documentNo: saved.code,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: saved.name, code: saved.code },
      });
    }
    
    return saved;
  }

  async update(id: number, dto: any, ctx?: AuditContext) {
    const customer = await this.findOne(id);
    const oldData = { name: customer.name, phone: customer.phone, email: customer.email };
    Object.assign(customer, dto);
    const saved = await this.customerRepository.save(customer);
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'CUSTOMER',
        action: 'UPDATE',
        documentId: id,
        documentNo: saved.code,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { before: oldData, after: { name: saved.name, phone: saved.phone, email: saved.email } },
      });
    }
    
    return saved;
  }

  async delete(id: number, ctx?: AuditContext) {
    const customer = await this.findOne(id);
    customer.isActive = false;
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'CUSTOMER',
        action: 'DELETE',
        documentId: id,
        documentNo: customer.code,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: customer.name },
      });
    }
    
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
