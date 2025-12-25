import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface AuditContext {
  userId: number;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
    private auditLogService: AuditLogService,
  ) {}

  async findAll() {
    return this.supplierRepository.find({ where: { isActive: true }, order: { code: 'ASC' } });
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id }, relations: ['contacts'] });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async create(dto: any, ctx?: AuditContext) {
    const supplier = this.supplierRepository.create({ ...dto, isActive: true });
    const saved = await this.supplierRepository.save(supplier) as SupplierEntity;
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'SUPPLIER',
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
    const supplier = await this.findOne(id);
    const oldData = { name: supplier.name, phone: supplier.phone };
    Object.assign(supplier, dto);
    const saved = await this.supplierRepository.save(supplier);
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'SUPPLIER',
        action: 'UPDATE',
        documentId: id,
        documentNo: saved.code,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { before: oldData, after: { name: saved.name, phone: saved.phone } },
      });
    }
    
    return saved;
  }

  async delete(id: number, ctx?: AuditContext) {
    const supplier = await this.findOne(id);
    supplier.isActive = false;
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'SUPPLIER',
        action: 'DELETE',
        documentId: id,
        documentNo: supplier.code,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: supplier.name },
      });
    }
    
    return this.supplierRepository.save(supplier);
  }
}
