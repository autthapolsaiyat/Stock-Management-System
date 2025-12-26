import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountEntity, BankAccountType } from '../entities/bank-account.entity';
import { ChartOfAccountEntity } from '../entities/chart-of-account.entity';
import { CreateBankAccountDto, UpdateBankAccountDto } from '../dto/bank-account.dto';
import { AuditLogService } from '../../audit-log/audit-log.service';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccountEntity)
    private bankRepo: Repository<BankAccountEntity>,
    @InjectRepository(ChartOfAccountEntity)
    private coaRepo: Repository<ChartOfAccountEntity>,
    private auditLogService: AuditLogService,
  ) {}

  async findAll(): Promise<BankAccountEntity[]> {
    return this.bankRepo.find({
      relations: ['chartOfAccount'],
      order: { code: 'ASC' },
    });
  }

  async findById(id: number): Promise<BankAccountEntity> {
    const bank = await this.bankRepo.findOne({
      where: { id },
      relations: ['chartOfAccount'],
    });
    if (!bank) {
      throw new NotFoundException(`Bank Account with ID ${id} not found`);
    }
    return bank;
  }

  async findDefault(): Promise<BankAccountEntity | null> {
    return this.bankRepo.findOne({
      where: { isDefault: true, isActive: true },
      relations: ['chartOfAccount'],
    });
  }

  async create(dto: CreateBankAccountDto, userId?: number): Promise<BankAccountEntity> {
    // Check if code exists
    const existing = await this.bankRepo.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new BadRequestException(`Bank account code ${dto.code} already exists`);
    }

    // Validate COA exists
    const coa = await this.coaRepo.findOne({ where: { id: dto.chartOfAccountId } });
    if (!coa) {
      throw new BadRequestException(`Chart of Account ID ${dto.chartOfAccountId} not found`);
    }

    // If this is set as default, unset other defaults
    if (dto.isDefault) {
      await this.bankRepo.update({}, { isDefault: false });
    }

    const bank = this.bankRepo.create({
      ...dto,
      openingBalanceDate: dto.openingBalanceDate ? new Date(dto.openingBalanceDate) : null,
      currentBalance: dto.openingBalance || 0,
      createdBy: userId,
      updatedBy: userId,
    });

    const saved = await this.bankRepo.save(bank);

    // Audit Log
    await this.auditLogService.log({
      module: 'BANK_ACCOUNT',
      action: 'CREATE',
      documentId: saved.id,
      documentNo: saved.code,
      userId: userId || 0,
      details: { name: saved.name, bankName: saved.bankName },
    });

    return saved;
  }

  async update(id: number, dto: UpdateBankAccountDto, userId?: number): Promise<BankAccountEntity> {
    const bank = await this.findById(id);

    // If setting as default, unset other defaults
    if (dto.isDefault) {
      await this.bankRepo.update({}, { isDefault: false });
    }

    const oldData = { ...bank };
    Object.assign(bank, dto);
    bank.updatedBy = userId;

    const saved = await this.bankRepo.save(bank);

    // Audit Log
    await this.auditLogService.log({
      module: 'BANK_ACCOUNT',
      action: 'UPDATE',
      documentId: saved.id,
      documentNo: saved.code,
      userId: userId || 0,
      details: { oldData, newData: dto },
    });

    return saved;
  }

  async delete(id: number, userId?: number): Promise<void> {
    const bank = await this.findById(id);

    // Audit Log
    await this.auditLogService.log({
      module: 'BANK_ACCOUNT',
      action: 'DELETE',
      documentId: bank.id,
      documentNo: bank.code,
      userId: userId || 0,
      details: { name: bank.name },
    });

    await this.bankRepo.remove(bank);
  }

  async updateBalance(id: number, amount: number): Promise<void> {
    const bank = await this.findById(id);
    bank.currentBalance = Number(bank.currentBalance) + amount;
    await this.bankRepo.save(bank);
  }
}
