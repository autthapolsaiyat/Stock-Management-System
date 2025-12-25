import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountEntity, BankAccountType } from '../entities/bank-account.entity';
import { ChartOfAccountEntity } from '../entities/chart-of-account.entity';
import { CreateBankAccountDto, UpdateBankAccountDto } from '../dto/bank-account.dto';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccountEntity)
    private bankRepo: Repository<BankAccountEntity>,
    @InjectRepository(ChartOfAccountEntity)
    private coaRepo: Repository<ChartOfAccountEntity>,
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

    return this.bankRepo.save(bank);
  }

  async update(id: number, dto: UpdateBankAccountDto, userId?: number): Promise<BankAccountEntity> {
    const bank = await this.findById(id);

    // If setting as default, unset other defaults
    if (dto.isDefault) {
      await this.bankRepo.update({}, { isDefault: false });
    }

    Object.assign(bank, dto);
    bank.updatedBy = userId;

    return this.bankRepo.save(bank);
  }

  async delete(id: number): Promise<void> {
    const bank = await this.findById(id);
    
    // TODO: Check if bank has transactions

    await this.bankRepo.remove(bank);
  }

  async updateBalance(id: number, amount: number): Promise<void> {
    const bank = await this.findById(id);
    bank.currentBalance = Number(bank.currentBalance) + amount;
    await this.bankRepo.save(bank);
  }
}
