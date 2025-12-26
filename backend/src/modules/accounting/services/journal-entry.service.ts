import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { JournalEntryEntity, JournalStatus, JournalType, ReferenceType } from '../entities/journal-entry.entity';
import { JournalEntryLineEntity } from '../entities/journal-entry-line.entity';
import { ChartOfAccountEntity } from '../entities/chart-of-account.entity';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from '../dto/journal-entry.dto';
import { DocNumberingService } from '../../doc-numbering/doc-numbering.service';
import { AuditLogService } from '../../audit-log/audit-log.service';

@Injectable()
export class JournalEntryService {
  constructor(
    @InjectRepository(JournalEntryEntity)
    private journalRepo: Repository<JournalEntryEntity>,
    @InjectRepository(JournalEntryLineEntity)
    private lineRepo: Repository<JournalEntryLineEntity>,
    @InjectRepository(ChartOfAccountEntity)
    private coaRepo: Repository<ChartOfAccountEntity>,
    private docNumberingService: DocNumberingService,
    private dataSource: DataSource,
    private auditLogService: AuditLogService,
  ) {}

  async findAll(params?: {
    startDate?: string;
    endDate?: string;
    journalType?: JournalType;
    status?: JournalStatus;
    referenceType?: ReferenceType;
  }): Promise<JournalEntryEntity[]> {
    const query = this.journalRepo.createQueryBuilder('je')
      .leftJoinAndSelect('je.lines', 'lines')
      .leftJoinAndSelect('lines.account', 'account')
      .orderBy('je.docDate', 'DESC')
      .addOrderBy('je.docNo', 'DESC');

    if (params?.startDate && params?.endDate) {
      query.andWhere('je.docDate BETWEEN :startDate AND :endDate', {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    }

    if (params?.journalType) {
      query.andWhere('je.journalType = :journalType', { journalType: params.journalType });
    }

    if (params?.status) {
      query.andWhere('je.status = :status', { status: params.status });
    }

    if (params?.referenceType) {
      query.andWhere('je.referenceType = :referenceType', { referenceType: params.referenceType });
    }

    return query.getMany();
  }

  async findById(id: number): Promise<JournalEntryEntity> {
    const entry = await this.journalRepo.findOne({
      where: { id },
      relations: ['lines', 'lines.account'],
    });
    if (!entry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }
    return entry;
  }

  async findByReference(referenceType: ReferenceType, referenceId: number): Promise<JournalEntryEntity[]> {
    return this.journalRepo.find({
      where: { referenceType, referenceId },
      relations: ['lines'],
    });
  }

  async create(dto: CreateJournalEntryDto, userId?: number): Promise<JournalEntryEntity> {
    // Validate lines - Debit must equal Credit
    const totalDebit = dto.lines.reduce((sum, l) => sum + Number(l.debitAmount || 0), 0);
    const totalCredit = dto.lines.reduce((sum, l) => sum + Number(l.creditAmount || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(`Debit (${totalDebit}) must equal Credit (${totalCredit})`);
    }

    // Generate document number
    const docDate = new Date(dto.docDate);
    const { docNo } = await this.docNumberingService.generateDocNumber('JV');

    // Calculate period
    const periodMonth = docDate.getMonth() + 1;
    const periodYear = docDate.getFullYear();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create journal entry
      const entry = this.journalRepo.create({
        docNo,
        journalType: dto.journalType || JournalType.GENERAL,
        docDate: docDate,
        postingDate: dto.postingDate ? new Date(dto.postingDate) : docDate,
        periodMonth,
        periodYear,
        description: dto.description,
        referenceType: dto.referenceType || ReferenceType.MANUAL,
        referenceId: dto.referenceId,
        referenceDocNo: dto.referenceDocNo,
        totalDebit,
        totalCredit,
        status: JournalStatus.DRAFT,
        createdBy: userId,
        updatedBy: userId,
      });

      const savedEntry = await queryRunner.manager.save(entry);

      // Create lines
      for (const lineDto of dto.lines) {
        const account = await this.coaRepo.findOne({ where: { id: lineDto.accountId } });
        if (!account) {
          throw new BadRequestException(`Account ID ${lineDto.accountId} not found`);
        }

        const line = this.lineRepo.create({
          journalEntryId: savedEntry.id,
          lineNo: lineDto.lineNo,
          accountId: lineDto.accountId,
          accountCode: account.code,
          accountName: account.name,
          description: lineDto.description,
          debitAmount: lineDto.debitAmount || 0,
          creditAmount: lineDto.creditAmount || 0,
          partnerType: lineDto.partnerType,
          partnerId: lineDto.partnerId,
          partnerName: lineDto.partnerName,
          costCenter: lineDto.costCenter,
          productId: lineDto.productId,
          warehouseId: lineDto.warehouseId,
        });

        await queryRunner.manager.save(line);
      }

      await queryRunner.commitTransaction();
      
      // Audit Log
      await this.auditLogService.log({
        module: 'JOURNAL_ENTRY',
        action: 'CREATE',
        documentId: savedEntry.id,
        documentNo: savedEntry.docNo,
        userId: userId || 0,
        details: { journalType: savedEntry.journalType, totalDebit, totalCredit },
      });

      return this.findById(savedEntry.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdateJournalEntryDto, userId?: number): Promise<JournalEntryEntity> {
    const entry = await this.findById(id);

    if (entry.status !== JournalStatus.DRAFT) {
      throw new BadRequestException('Can only update DRAFT journal entries');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (dto.docDate) {
        entry.docDate = new Date(dto.docDate);
        entry.periodMonth = entry.docDate.getMonth() + 1;
        entry.periodYear = entry.docDate.getFullYear();
      }

      if (dto.description !== undefined) {
        entry.description = dto.description;
      }

      if (dto.lines) {
        // Validate lines
        const totalDebit = dto.lines.reduce((sum, l) => sum + Number(l.debitAmount || 0), 0);
        const totalCredit = dto.lines.reduce((sum, l) => sum + Number(l.creditAmount || 0), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
          throw new BadRequestException(`Debit (${totalDebit}) must equal Credit (${totalCredit})`);
        }

        // Delete existing lines
        await queryRunner.manager.delete(JournalEntryLineEntity, { journalEntryId: id });

        // Create new lines
        for (const lineDto of dto.lines) {
          const account = await this.coaRepo.findOne({ where: { id: lineDto.accountId } });
          if (!account) {
            throw new BadRequestException(`Account ID ${lineDto.accountId} not found`);
          }

          const line = this.lineRepo.create({
            journalEntryId: id,
            lineNo: lineDto.lineNo,
            accountId: lineDto.accountId,
            accountCode: account.code,
            accountName: account.name,
            description: lineDto.description,
            debitAmount: lineDto.debitAmount || 0,
            creditAmount: lineDto.creditAmount || 0,
            partnerType: lineDto.partnerType,
            partnerId: lineDto.partnerId,
            partnerName: lineDto.partnerName,
            costCenter: lineDto.costCenter,
          });

          await queryRunner.manager.save(line);
        }

        entry.totalDebit = totalDebit;
        entry.totalCredit = totalCredit;
      }

      entry.updatedBy = userId;
      await queryRunner.manager.save(entry);

      await queryRunner.commitTransaction();
      return this.findById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: number, userId?: number): Promise<JournalEntryEntity> {
    const entry = await this.findById(id);

    if (entry.status !== JournalStatus.DRAFT) {
      throw new BadRequestException('Can only post DRAFT journal entries');
    }

    entry.status = JournalStatus.POSTED;
    entry.postedAt = new Date();
    entry.postedBy = userId;
    entry.updatedBy = userId;

    const saved = await this.journalRepo.save(entry);

    // Audit Log
    await this.auditLogService.log({
      module: 'JOURNAL_ENTRY',
      action: 'POST',
      documentId: saved.id,
      documentNo: saved.docNo,
      userId: userId || 0,
      details: { journalType: saved.journalType, totalDebit: saved.totalDebit, totalCredit: saved.totalCredit },
    });

    return saved;
  }

  async cancel(id: number, reason: string, userId?: number): Promise<JournalEntryEntity> {
    const entry = await this.findById(id);

    if (entry.status === JournalStatus.CANCELLED) {
      throw new BadRequestException('Journal entry is already cancelled');
    }

    entry.status = JournalStatus.CANCELLED;
    entry.cancelledAt = new Date();
    entry.cancelledBy = userId;
    entry.cancelReason = reason;
    entry.updatedBy = userId;

    const saved = await this.journalRepo.save(entry);

    // Audit Log
    await this.auditLogService.log({
      module: 'JOURNAL_ENTRY',
      action: 'CANCEL',
      documentId: saved.id,
      documentNo: saved.docNo,
      userId: userId || 0,
      details: { reason },
    });

    return saved;
  }

  async reverse(id: number, userId?: number): Promise<JournalEntryEntity> {
    const original = await this.findById(id);

    if (original.status !== JournalStatus.POSTED) {
      throw new BadRequestException('Can only reverse POSTED journal entries');
    }

    // Create reversing entry
    const { docNo } = await this.docNumberingService.generateDocNumber('JV');

    const reversing = this.journalRepo.create({
      docNo,
      journalType: original.journalType,
      docDate: new Date(),
      postingDate: new Date(),
      periodMonth: new Date().getMonth() + 1,
      periodYear: new Date().getFullYear(),
      description: `Reverse of ${original.docNo}: ${original.description || ''}`,
      referenceType: original.referenceType,
      referenceId: original.referenceId,
      referenceDocNo: original.referenceDocNo,
      totalDebit: original.totalCredit, // Swap
      totalCredit: original.totalDebit, // Swap
      status: JournalStatus.POSTED,
      isReversing: true,
      reversedFromId: original.id,
      postedAt: new Date(),
      postedBy: userId,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedReversing = await this.journalRepo.save(reversing);

    // Create reversed lines (swap debit/credit)
    for (const line of original.lines) {
      const reversedLine = this.lineRepo.create({
        journalEntryId: savedReversing.id,
        lineNo: line.lineNo,
        accountId: line.accountId,
        accountCode: line.accountCode,
        accountName: line.accountName,
        description: `Reverse: ${line.description || ''}`,
        debitAmount: line.creditAmount, // Swap
        creditAmount: line.debitAmount, // Swap
        partnerType: line.partnerType,
        partnerId: line.partnerId,
        partnerName: line.partnerName,
        costCenter: line.costCenter,
        productId: line.productId,
        warehouseId: line.warehouseId,
      });

      await this.lineRepo.save(reversedLine);
    }

    // Update original entry
    original.reversedById = savedReversing.id;
    await this.journalRepo.save(original);

    // Audit Log
    await this.auditLogService.log({
      module: 'JOURNAL_ENTRY',
      action: 'REVERSE',
      documentId: savedReversing.id,
      documentNo: savedReversing.docNo,
      userId: userId || 0,
      details: { originalDocNo: original.docNo, originalId: original.id },
    });

    return this.findById(savedReversing.id);
  }

  async delete(id: number, userId?: number): Promise<void> {
    const entry = await this.findById(id);

    if (entry.status !== JournalStatus.DRAFT) {
      throw new BadRequestException('Can only delete DRAFT journal entries');
    }

    // Audit Log
    await this.auditLogService.log({
      module: 'JOURNAL_ENTRY',
      action: 'DELETE',
      documentId: entry.id,
      documentNo: entry.docNo,
      userId: userId || 0,
      details: { journalType: entry.journalType },
    });

    await this.journalRepo.remove(entry);
  }

  // ==================== AUTO JOURNAL GENERATION ====================

  async createFromSalesInvoice(
    invoiceId: number,
    invoiceDocNo: string,
    customerId: number,
    customerName: string,
    subtotal: number,
    taxAmount: number,
    grandTotal: number,
    docDate: Date,
    userId?: number,
  ): Promise<JournalEntryEntity> {
    // Get default accounts
    const arAccount = await this.coaRepo.findOne({ where: { isDefaultAR: true } });
    const salesAccount = await this.coaRepo.findOne({ where: { isDefaultSales: true } });
    const vatOutputAccount = await this.coaRepo.findOne({ where: { isDefaultVatOutput: true } });

    if (!arAccount || !salesAccount || !vatOutputAccount) {
      throw new BadRequestException('Default accounts not configured');
    }

    const lines = [
      {
        lineNo: 1,
        accountId: arAccount.id,
        description: `ลูกหนี้การค้า - ${customerName}`,
        debitAmount: grandTotal,
        creditAmount: 0,
        partnerType: 'CUSTOMER',
        partnerId: customerId,
        partnerName: customerName,
      },
      {
        lineNo: 2,
        accountId: salesAccount.id,
        description: 'รายได้จากการขาย',
        debitAmount: 0,
        creditAmount: subtotal,
      },
    ];

    if (taxAmount > 0) {
      lines.push({
        lineNo: 3,
        accountId: vatOutputAccount.id,
        description: 'ภาษีขาย',
        debitAmount: 0,
        creditAmount: taxAmount,
      });
    }

    return this.create({
      journalType: JournalType.SALES,
      docDate: docDate.toISOString().split('T')[0],
      description: `บันทึกขาย - ${invoiceDocNo}`,
      referenceType: ReferenceType.SALES_INVOICE,
      referenceId: invoiceId,
      referenceDocNo: invoiceDocNo,
      lines,
    }, userId);
  }

  async createFromGoodsReceipt(
    grId: number,
    grDocNo: string,
    supplierId: number,
    supplierName: string,
    subtotal: number,
    taxAmount: number,
    grandTotal: number,
    docDate: Date,
    userId?: number,
  ): Promise<JournalEntryEntity> {
    // Get default accounts
    const inventoryAccount = await this.coaRepo.findOne({ where: { isDefaultInventory: true } });
    const apAccount = await this.coaRepo.findOne({ where: { isDefaultAP: true } });
    const vatInputAccount = await this.coaRepo.findOne({ where: { isDefaultVatInput: true } });

    if (!inventoryAccount || !apAccount || !vatInputAccount) {
      throw new BadRequestException('Default accounts not configured');
    }

    const lines: Array<{
      lineNo: number;
      accountId: number;
      description: string;
      debitAmount: number;
      creditAmount: number;
      partnerType?: string;
      partnerId?: number;
      partnerName?: string;
    }> = [
      {
        lineNo: 1,
        accountId: inventoryAccount.id,
        description: 'สินค้าคงเหลือ',
        debitAmount: subtotal,
        creditAmount: 0,
      },
    ];

    if (taxAmount > 0) {
      lines.push({
        lineNo: 2,
        accountId: vatInputAccount.id,
        description: 'ภาษีซื้อ',
        debitAmount: taxAmount,
        creditAmount: 0,
      });
    }

    lines.push({
      lineNo: lines.length + 1,
      accountId: apAccount.id,
      description: `เจ้าหนี้การค้า - ${supplierName}`,
      debitAmount: 0,
      creditAmount: grandTotal,
      partnerType: 'SUPPLIER',
      partnerId: supplierId,
      partnerName: supplierName,
    });

    return this.create({
      journalType: JournalType.PURCHASE,
      docDate: docDate.toISOString().split('T')[0],
      description: `บันทึกรับสินค้า - ${grDocNo}`,
      referenceType: ReferenceType.GOODS_RECEIPT,
      referenceId: grId,
      referenceDocNo: grDocNo,
      lines,
    }, userId);
  }

  // ==================== REPORTING ====================

  async getTrialBalance(startDate: string, endDate: string): Promise<any[]> {
    const result = await this.lineRepo.createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'je')
      .innerJoin('line.account', 'account')
      .select('account.id', 'accountId')
      .addSelect('account.code', 'accountCode')
      .addSelect('account.name', 'accountName')
      .addSelect('account.accountType', 'accountType')
      .addSelect('account.balanceType', 'balanceType')
      .addSelect('SUM(line.debitAmount)', 'totalDebit')
      .addSelect('SUM(line.creditAmount)', 'totalCredit')
      .where('je.status = :status', { status: JournalStatus.POSTED })
      .andWhere('je.docDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('account.id')
      .addGroupBy('account.code')
      .addGroupBy('account.name')
      .addGroupBy('account.accountType')
      .addGroupBy('account.balanceType')
      .orderBy('account.code', 'ASC')
      .getRawMany();

    return result.map(r => ({
      ...r,
      totalDebit: Number(r.totalDebit) || 0,
      totalCredit: Number(r.totalCredit) || 0,
      balance: (Number(r.totalDebit) || 0) - (Number(r.totalCredit) || 0),
    }));
  }

  async getAccountBalance(accountId: number, asOfDate: string): Promise<number> {
    const result = await this.lineRepo.createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'je')
      .select('SUM(line.debitAmount) - SUM(line.creditAmount)', 'balance')
      .where('line.accountId = :accountId', { accountId })
      .andWhere('je.status = :status', { status: JournalStatus.POSTED })
      .andWhere('je.docDate <= :asOfDate', { asOfDate })
      .getRawOne();

    return Number(result?.balance) || 0;
  }
}
