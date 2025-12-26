import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartOfAccountEntity, AccountType, AccountGroup, BalanceType } from '../entities/chart-of-account.entity';
import { CreateChartOfAccountDto, UpdateChartOfAccountDto } from '../dto/chart-of-account.dto';
import { AuditLogService } from '../../audit-log/audit-log.service';

@Injectable()
export class ChartOfAccountService {
  constructor(
    @InjectRepository(ChartOfAccountEntity)
    private coaRepo: Repository<ChartOfAccountEntity>,
    private auditLogService: AuditLogService,
  ) {}

  async findAll(): Promise<ChartOfAccountEntity[]> {
    return this.coaRepo.find({
      order: { code: 'ASC' },
      relations: ['parent', 'children'],
    });
  }

  async findById(id: number): Promise<ChartOfAccountEntity> {
    const account = await this.coaRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async findByCode(code: string): Promise<ChartOfAccountEntity> {
    const account = await this.coaRepo.findOne({ where: { code } });
    if (!account) {
      throw new NotFoundException(`Account with code ${code} not found`);
    }
    return account;
  }

  async findByType(accountType: AccountType): Promise<ChartOfAccountEntity[]> {
    return this.coaRepo.find({
      where: { accountType, isActive: true },
      order: { code: 'ASC' },
    });
  }

  async findByGroup(accountGroup: AccountGroup): Promise<ChartOfAccountEntity[]> {
    return this.coaRepo.find({
      where: { accountGroup, isActive: true },
      order: { code: 'ASC' },
    });
  }

  async findDefaultAccount(type: string): Promise<ChartOfAccountEntity | null> {
    const whereCondition: any = { isActive: true };
    
    switch (type) {
      case 'AR':
        whereCondition.isDefaultAR = true;
        break;
      case 'AP':
        whereCondition.isDefaultAP = true;
        break;
      case 'INVENTORY':
        whereCondition.isDefaultInventory = true;
        break;
      case 'SALES':
        whereCondition.isDefaultSales = true;
        break;
      case 'COGS':
        whereCondition.isDefaultCOGS = true;
        break;
      case 'VAT_OUTPUT':
        whereCondition.isDefaultVatOutput = true;
        break;
      case 'VAT_INPUT':
        whereCondition.isDefaultVatInput = true;
        break;
      default:
        return null;
    }

    return this.coaRepo.findOne({ where: whereCondition });
  }

  async create(dto: CreateChartOfAccountDto, userId?: number): Promise<ChartOfAccountEntity> {
    // Check if code already exists
    const existing = await this.coaRepo.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new BadRequestException(`Account code ${dto.code} already exists`);
    }

    // Calculate level based on parent
    let level = 1;
    if (dto.parentId) {
      const parent = await this.findById(dto.parentId);
      level = parent.level + 1;
    }

    const account = this.coaRepo.create({
      ...dto,
      level,
      createdBy: userId,
      updatedBy: userId,
    });

    const saved = await this.coaRepo.save(account);

    // Audit Log
    await this.auditLogService.log({
      module: 'CHART_OF_ACCOUNT',
      action: 'CREATE',
      documentId: saved.id,
      documentNo: saved.code,
      userId: userId || 0,
      details: { name: saved.name, accountType: saved.accountType },
    });

    return saved;
  }

  async update(id: number, dto: UpdateChartOfAccountDto, userId?: number): Promise<ChartOfAccountEntity> {
    const account = await this.findById(id);

    if (account.isSystem) {
      throw new BadRequestException('Cannot modify system account');
    }

    const oldData = { ...account };
    Object.assign(account, dto);
    account.updatedBy = userId;

    const saved = await this.coaRepo.save(account);

    // Audit Log
    await this.auditLogService.log({
      module: 'CHART_OF_ACCOUNT',
      action: 'UPDATE',
      documentId: saved.id,
      documentNo: saved.code,
      userId: userId || 0,
      details: { oldData, newData: dto },
    });

    return saved;
  }

  async delete(id: number, userId?: number): Promise<void> {
    const account = await this.findById(id);

    if (account.isSystem) {
      throw new BadRequestException('Cannot delete system account');
    }

    // Check if has children
    const children = await this.coaRepo.count({ where: { parentId: id } });
    if (children > 0) {
      throw new BadRequestException('Cannot delete account with sub-accounts');
    }

    // Audit Log
    await this.auditLogService.log({
      module: 'CHART_OF_ACCOUNT',
      action: 'DELETE',
      documentId: account.id,
      documentNo: account.code,
      userId: userId || 0,
      details: { name: account.name, accountType: account.accountType },
    });

    await this.coaRepo.remove(account);
  }

  async initializeDefaultAccounts(): Promise<void> {
    const count = await this.coaRepo.count();
    if (count > 0) {
      return; // Already initialized
    }

    const defaultAccounts: Partial<ChartOfAccountEntity>[] = [
      // ASSETS - สินทรัพย์
      { code: '1000', name: 'สินทรัพย์', nameEn: 'Assets', accountType: AccountType.ASSET, accountGroup: AccountGroup.CURRENT_ASSET, balanceType: BalanceType.DEBIT, level: 1, isSystem: true },
      { code: '1100', name: 'สินทรัพย์หมุนเวียน', nameEn: 'Current Assets', accountType: AccountType.ASSET, accountGroup: AccountGroup.CURRENT_ASSET, balanceType: BalanceType.DEBIT, level: 2, isSystem: true },
      { code: '1110', name: 'เงินสดและเงินฝากธนาคาร', nameEn: 'Cash and Bank', accountType: AccountType.ASSET, accountGroup: AccountGroup.CURRENT_ASSET, balanceType: BalanceType.DEBIT, level: 3, isSystem: true },
      { code: '1111', name: 'เงินสด', nameEn: 'Cash', accountType: AccountType.ASSET, accountGroup: AccountGroup.CURRENT_ASSET, balanceType: BalanceType.DEBIT, level: 4, isSystem: true },
      { code: '1112', name: 'เงินฝากธนาคาร', nameEn: 'Bank Deposits', accountType: AccountType.ASSET, accountGroup: AccountGroup.CURRENT_ASSET, balanceType: BalanceType.DEBIT, level: 4, isSystem: true, isControl: true, controlType: 'BANK' },
      { code: '1120', name: 'ลูกหนี้การค้า', nameEn: 'Accounts Receivable', accountType: AccountType.ASSET, accountGroup: AccountGroup.CURRENT_ASSET, balanceType: BalanceType.DEBIT, level: 3, isSystem: true, isControl: true, controlType: 'AR', isDefaultAR: true },
      { code: '1130', name: 'สินค้าคงเหลือ', nameEn: 'Inventory', accountType: AccountType.ASSET, accountGroup: AccountGroup.CURRENT_ASSET, balanceType: BalanceType.DEBIT, level: 3, isSystem: true, isControl: true, controlType: 'INVENTORY', isDefaultInventory: true },
      { code: '1140', name: 'ภาษีซื้อ', nameEn: 'Input VAT', accountType: AccountType.ASSET, accountGroup: AccountGroup.CURRENT_ASSET, balanceType: BalanceType.DEBIT, level: 3, isSystem: true, isDefaultVatInput: true },
      { code: '1200', name: 'สินทรัพย์ถาวร', nameEn: 'Fixed Assets', accountType: AccountType.ASSET, accountGroup: AccountGroup.FIXED_ASSET, balanceType: BalanceType.DEBIT, level: 2, isSystem: true },

      // LIABILITIES - หนี้สิน
      { code: '2000', name: 'หนี้สิน', nameEn: 'Liabilities', accountType: AccountType.LIABILITY, accountGroup: AccountGroup.CURRENT_LIABILITY, balanceType: BalanceType.CREDIT, level: 1, isSystem: true },
      { code: '2100', name: 'หนี้สินหมุนเวียน', nameEn: 'Current Liabilities', accountType: AccountType.LIABILITY, accountGroup: AccountGroup.CURRENT_LIABILITY, balanceType: BalanceType.CREDIT, level: 2, isSystem: true },
      { code: '2110', name: 'เจ้าหนี้การค้า', nameEn: 'Accounts Payable', accountType: AccountType.LIABILITY, accountGroup: AccountGroup.CURRENT_LIABILITY, balanceType: BalanceType.CREDIT, level: 3, isSystem: true, isControl: true, controlType: 'AP', isDefaultAP: true },
      { code: '2120', name: 'ภาษีขาย', nameEn: 'Output VAT', accountType: AccountType.LIABILITY, accountGroup: AccountGroup.CURRENT_LIABILITY, balanceType: BalanceType.CREDIT, level: 3, isSystem: true, isDefaultVatOutput: true },
      { code: '2130', name: 'ภาษีเงินได้หัก ณ ที่จ่ายค้างจ่าย', nameEn: 'Withholding Tax Payable', accountType: AccountType.LIABILITY, accountGroup: AccountGroup.CURRENT_LIABILITY, balanceType: BalanceType.CREDIT, level: 3, isSystem: true },

      // EQUITY - ส่วนของผู้ถือหุ้น
      { code: '3000', name: 'ส่วนของผู้ถือหุ้น', nameEn: 'Equity', accountType: AccountType.EQUITY, accountGroup: AccountGroup.SHARE_CAPITAL, balanceType: BalanceType.CREDIT, level: 1, isSystem: true },
      { code: '3100', name: 'ทุนเรือนหุ้น', nameEn: 'Share Capital', accountType: AccountType.EQUITY, accountGroup: AccountGroup.SHARE_CAPITAL, balanceType: BalanceType.CREDIT, level: 2, isSystem: true },
      { code: '3200', name: 'กำไรสะสม', nameEn: 'Retained Earnings', accountType: AccountType.EQUITY, accountGroup: AccountGroup.RETAINED_EARNINGS, balanceType: BalanceType.CREDIT, level: 2, isSystem: true },

      // REVENUE - รายได้
      { code: '4000', name: 'รายได้', nameEn: 'Revenue', accountType: AccountType.REVENUE, accountGroup: AccountGroup.SALES_REVENUE, balanceType: BalanceType.CREDIT, level: 1, isSystem: true },
      { code: '4100', name: 'รายได้จากการขาย', nameEn: 'Sales Revenue', accountType: AccountType.REVENUE, accountGroup: AccountGroup.SALES_REVENUE, balanceType: BalanceType.CREDIT, level: 2, isSystem: true, isDefaultSales: true },
      { code: '4200', name: 'รายได้อื่น', nameEn: 'Other Income', accountType: AccountType.REVENUE, accountGroup: AccountGroup.OTHER_REVENUE, balanceType: BalanceType.CREDIT, level: 2, isSystem: true },
      { code: '4210', name: 'ส่วนลดรับ', nameEn: 'Purchase Discount', accountType: AccountType.REVENUE, accountGroup: AccountGroup.OTHER_REVENUE, balanceType: BalanceType.CREDIT, level: 3, isSystem: true },

      // EXPENSE - ค่าใช้จ่าย
      { code: '5000', name: 'ค่าใช้จ่าย', nameEn: 'Expenses', accountType: AccountType.EXPENSE, accountGroup: AccountGroup.COST_OF_GOODS, balanceType: BalanceType.DEBIT, level: 1, isSystem: true },
      { code: '5100', name: 'ต้นทุนขาย', nameEn: 'Cost of Goods Sold', accountType: AccountType.EXPENSE, accountGroup: AccountGroup.COST_OF_GOODS, balanceType: BalanceType.DEBIT, level: 2, isSystem: true, isDefaultCOGS: true },
      { code: '5200', name: 'ค่าใช้จ่ายในการขาย', nameEn: 'Selling Expenses', accountType: AccountType.EXPENSE, accountGroup: AccountGroup.OPERATING_EXPENSE, balanceType: BalanceType.DEBIT, level: 2, isSystem: true },
      { code: '5210', name: 'ส่วนลดจ่าย', nameEn: 'Sales Discount', accountType: AccountType.EXPENSE, accountGroup: AccountGroup.OPERATING_EXPENSE, balanceType: BalanceType.DEBIT, level: 3, isSystem: true },
      { code: '5300', name: 'ค่าใช้จ่ายในการบริหาร', nameEn: 'Administrative Expenses', accountType: AccountType.EXPENSE, accountGroup: AccountGroup.OPERATING_EXPENSE, balanceType: BalanceType.DEBIT, level: 2, isSystem: true },
      { code: '5900', name: 'ค่าใช้จ่ายอื่น', nameEn: 'Other Expenses', accountType: AccountType.EXPENSE, accountGroup: AccountGroup.OTHER_EXPENSE, balanceType: BalanceType.DEBIT, level: 2, isSystem: true },
    ];

    // Set parent relationships based on code structure
    for (const account of defaultAccounts) {
      const entity = this.coaRepo.create(account);
      await this.coaRepo.save(entity);
    }

    // Update parent relationships
    const accounts = await this.coaRepo.find({ order: { code: 'ASC' } });
    for (const account of accounts) {
      if (account.code.length > 4) {
        // Find parent by truncating code
        const parentCode = account.code.substring(0, account.code.length - 1);
        const parent = accounts.find(a => a.code === parentCode);
        if (parent) {
          account.parentId = parent.id;
          await this.coaRepo.save(account);
        }
      }
    }
  }

  async getAccountTree(): Promise<any[]> {
    const accounts = await this.coaRepo.find({
      where: { isActive: true },
      order: { code: 'ASC' },
    });

    // Build tree structure
    const buildTree = (parentId: number | null): any[] => {
      return accounts
        .filter(a => a.parentId === parentId)
        .map(a => ({
          ...a,
          children: buildTree(a.id),
        }));
    };

    return buildTree(null);
  }
}
