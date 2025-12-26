import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaymentVoucherEntity } from '../entities/payment-voucher.entity';
import { PaymentVoucherItemEntity } from '../entities/payment-voucher-item.entity';
import { PaymentStatus, PaymentMethod } from '../entities/payment-receipt.entity';
import { ArApOutstandingEntity, OutstandingType, OutstandingStatus } from '../entities/ar-ap-outstanding.entity';
import { ChartOfAccountEntity } from '../entities/chart-of-account.entity';
import { BankAccountEntity } from '../entities/bank-account.entity';
import { JournalEntryEntity, JournalType, JournalStatus, ReferenceType } from '../entities/journal-entry.entity';
import { JournalEntryLineEntity } from '../entities/journal-entry-line.entity';
import { CreatePaymentVoucherDto } from '../dto/payment.dto';
import { DocNumberingService } from '../../doc-numbering/doc-numbering.service';
import { AuditLogService } from '../../audit-log/audit-log.service';

@Injectable()
export class PaymentVoucherService {
  constructor(
    @InjectRepository(PaymentVoucherEntity)
    private voucherRepo: Repository<PaymentVoucherEntity>,
    @InjectRepository(PaymentVoucherItemEntity)
    private itemRepo: Repository<PaymentVoucherItemEntity>,
    @InjectRepository(ArApOutstandingEntity)
    private outstandingRepo: Repository<ArApOutstandingEntity>,
    @InjectRepository(ChartOfAccountEntity)
    private coaRepo: Repository<ChartOfAccountEntity>,
    @InjectRepository(BankAccountEntity)
    private bankRepo: Repository<BankAccountEntity>,
    @InjectRepository(JournalEntryEntity)
    private journalRepo: Repository<JournalEntryEntity>,
    @InjectRepository(JournalEntryLineEntity)
    private journalLineRepo: Repository<JournalEntryLineEntity>,
    private docNumberingService: DocNumberingService,
    private dataSource: DataSource,
    private auditLogService: AuditLogService,
  ) {}

  async findAll(params?: {
    supplierId?: number;
    startDate?: string;
    endDate?: string;
    status?: PaymentStatus;
  }): Promise<PaymentVoucherEntity[]> {
    const query = this.voucherRepo.createQueryBuilder('pv')
      .leftJoinAndSelect('pv.items', 'items')
      .orderBy('pv.docDate', 'DESC')
      .addOrderBy('pv.docNo', 'DESC');

    if (params?.supplierId) {
      query.andWhere('pv.supplierId = :supplierId', { supplierId: params.supplierId });
    }

    if (params?.startDate && params?.endDate) {
      query.andWhere('pv.docDate BETWEEN :startDate AND :endDate', {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    }

    if (params?.status) {
      query.andWhere('pv.status = :status', { status: params.status });
    }

    return query.getMany();
  }

  async findById(id: number): Promise<PaymentVoucherEntity> {
    const voucher = await this.voucherRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!voucher) {
      throw new NotFoundException(`Payment Voucher with ID ${id} not found`);
    }
    return voucher;
  }

  async getSupplierOutstanding(supplierId: number): Promise<ArApOutstandingEntity[]> {
    return this.outstandingRepo.find({
      where: {
        type: OutstandingType.AP,
        partnerId: supplierId,
        status: OutstandingStatus.OPEN,
      },
      order: { docDate: 'ASC' },
    });
  }

  async create(dto: CreatePaymentVoucherDto, userId?: number): Promise<PaymentVoucherEntity> {
    const docDate = new Date(dto.docDate);
    const { docNo } = await this.docNumberingService.generateDocNumber('PV');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get supplier info from first outstanding item
      let supplierCode = '';
      let supplierName = '';

      // Calculate totals
      let totalAmount = 0;
      let totalDiscount = 0;
      let totalWHT = 0;

      const itemsData: any[] = [];

      for (const itemDto of dto.items) {
        // Get outstanding record
        const outstanding = await this.outstandingRepo.findOne({
          where: { 
            docId: itemDto.referenceId, 
            type: OutstandingType.AP,
            docType: itemDto.referenceType,
          },
        });

        if (!outstanding) {
          throw new BadRequestException(`Reference ${itemDto.referenceType} ID ${itemDto.referenceId} not found in outstanding`);
        }

        if (outstanding.outstandingAmount < itemDto.paymentAmount) {
          throw new BadRequestException(`Payment amount exceeds outstanding for ${outstanding.docNo}`);
        }

        if (!supplierCode) {
          supplierCode = outstanding.partnerCode;
          supplierName = outstanding.partnerName;
        }

        const discount = itemDto.discountAmount || 0;
        const wht = itemDto.withholdingTax || 0;
        const netAmount = itemDto.paymentAmount - discount - wht;
        const remainingAmount = outstanding.outstandingAmount - itemDto.paymentAmount;

        totalAmount += itemDto.paymentAmount;
        totalDiscount += discount;
        totalWHT += wht;

        itemsData.push({
          lineNo: itemDto.lineNo,
          referenceType: itemDto.referenceType,
          referenceId: itemDto.referenceId,
          referenceDocNo: outstanding.docNo,
          referenceDate: outstanding.docDate,
          referenceDueDate: outstanding.dueDate,
          referenceAmount: outstanding.originalAmount,
          outstandingAmount: outstanding.outstandingAmount,
          paymentAmount: itemDto.paymentAmount,
          discountAmount: discount,
          withholdingTax: wht,
          netAmount,
          remainingAmount,
          remark: itemDto.remark,
        });
      }

      const netAmount = totalAmount - totalDiscount - totalWHT;

      // Get bank account name if provided
      let bankAccountName = null;
      if (dto.bankAccountId) {
        const bank = await this.bankRepo.findOne({ where: { id: dto.bankAccountId } });
        bankAccountName = bank?.name;
      }

      // Create voucher
      const voucher = this.voucherRepo.create({
        docNo,
        docDate,
        supplierId: dto.supplierId,
        supplierCode,
        supplierName,
        paymentMethod: dto.paymentMethod,
        bankAccountId: dto.bankAccountId,
        bankAccountName,
        chequeNo: dto.chequeNo,
        chequeDate: dto.chequeDate ? new Date(dto.chequeDate) : null,
        referenceNo: dto.referenceNo,
        totalAmount,
        discountAmount: totalDiscount,
        withholdingTax: totalWHT,
        netAmount,
        status: PaymentStatus.DRAFT,
        remark: dto.remark,
        createdBy: userId,
        updatedBy: userId,
      });

      const savedVoucher = await queryRunner.manager.save(voucher);

      // Create items
      for (const itemData of itemsData) {
        const item = this.itemRepo.create({
          paymentVoucherId: savedVoucher.id,
          ...itemData,
        });
        await queryRunner.manager.save(item);
      }

      await queryRunner.commitTransaction();

      // Audit Log
      await this.auditLogService.log({
        module: 'PAYMENT_VOUCHER',
        action: 'CREATE',
        documentId: savedVoucher.id,
        documentNo: savedVoucher.docNo,
        userId: userId || 0,
        details: { supplierName, netAmount },
      });

      return this.findById(savedVoucher.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: number, userId?: number): Promise<PaymentVoucherEntity> {
    const voucher = await this.findById(id);

    if (voucher.status !== PaymentStatus.DRAFT) {
      throw new BadRequestException('Can only post DRAFT payment vouchers');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update outstanding records
      for (const item of voucher.items) {
        const outstanding = await this.outstandingRepo.findOne({
          where: { 
            docId: item.referenceId, 
            type: OutstandingType.AP,
            docType: item.referenceType,
          },
        });

        if (outstanding) {
          outstanding.paidAmount = Number(outstanding.paidAmount) + Number(item.paymentAmount);
          outstanding.outstandingAmount = Number(outstanding.originalAmount) - Number(outstanding.paidAmount);
          outstanding.discountAmount = Number(outstanding.discountAmount || 0) + Number(item.discountAmount || 0);
          outstanding.withholdingTax = Number(outstanding.withholdingTax || 0) + Number(item.withholdingTax || 0);
          outstanding.lastPaymentDate = voucher.docDate;
          outstanding.lastPaymentAmount = item.paymentAmount;

          if (outstanding.outstandingAmount <= 0.01) {
            outstanding.status = OutstandingStatus.PAID;
            outstanding.fullyPaidAt = new Date();
          } else {
            outstanding.status = OutstandingStatus.PARTIAL;
          }

          await queryRunner.manager.save(outstanding);
        }
      }

      // Create journal entry
      const journalEntry = await this.createJournalEntry(voucher, queryRunner.manager, userId);

      // Update voucher
      voucher.status = PaymentStatus.POSTED;
      voucher.postedAt = new Date();
      voucher.postedBy = userId;
      voucher.journalEntryId = journalEntry.id;
      voucher.journalDocNo = journalEntry.docNo;
      voucher.updatedBy = userId;

      await queryRunner.manager.save(voucher);

      await queryRunner.commitTransaction();

      // Audit Log
      await this.auditLogService.log({
        module: 'PAYMENT_VOUCHER',
        action: 'POST',
        documentId: voucher.id,
        documentNo: voucher.docNo,
        userId: userId || 0,
        details: { supplierName: voucher.supplierName, netAmount: voucher.netAmount, journalDocNo: voucher.journalDocNo },
      });

      return this.findById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createJournalEntry(voucher: PaymentVoucherEntity, manager: any, userId?: number): Promise<JournalEntryEntity> {
    // Get default accounts
    const apAccount = await this.coaRepo.findOne({ where: { isDefaultAP: true } });
    let cashBankAccount: ChartOfAccountEntity;

    if (voucher.bankAccountId) {
      const bank = await this.bankRepo.findOne({ 
        where: { id: voucher.bankAccountId },
        relations: ['chartOfAccount'],
      });
      cashBankAccount = bank?.chartOfAccount;
    }

    if (!cashBankAccount) {
      cashBankAccount = await this.coaRepo.findOne({ where: { code: '1111' } }); // เงินสด
    }

    if (!apAccount || !cashBankAccount) {
      throw new BadRequestException('Default accounts not configured');
    }

    const { docNo } = await this.docNumberingService.generateDocNumber('JV');
    const docDate = voucher.docDate;

    const entry = this.journalRepo.create({
      docNo,
      journalType: JournalType.CASH_PAYMENT,
      docDate,
      postingDate: docDate,
      periodMonth: docDate.getMonth() + 1,
      periodYear: docDate.getFullYear(),
      description: `จ่ายชำระเงิน - ${voucher.docNo} ให้ ${voucher.supplierName}`,
      referenceType: ReferenceType.PAYMENT_VOUCHER,
      referenceId: voucher.id,
      referenceDocNo: voucher.docNo,
      totalDebit: voucher.totalAmount,
      totalCredit: voucher.totalAmount,
      status: JournalStatus.POSTED,
      isAutoGenerated: true,
      postedAt: new Date(),
      postedBy: userId,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedEntry = await manager.save(entry);

    // Line 1: Dr. AP
    const line1 = this.journalLineRepo.create({
      journalEntryId: savedEntry.id,
      lineNo: 1,
      accountId: apAccount.id,
      accountCode: apAccount.code,
      accountName: apAccount.name,
      description: `ตัดเจ้าหนี้ - ${voucher.supplierName}`,
      debitAmount: voucher.totalAmount,
      creditAmount: 0,
      partnerType: 'SUPPLIER',
      partnerId: voucher.supplierId,
      partnerName: voucher.supplierName,
    });
    await manager.save(line1);

    // Line 2: Cr. Cash/Bank
    const line2 = this.journalLineRepo.create({
      journalEntryId: savedEntry.id,
      lineNo: 2,
      accountId: cashBankAccount.id,
      accountCode: cashBankAccount.code,
      accountName: cashBankAccount.name,
      description: `จ่ายเงิน - ${voucher.paymentMethod}`,
      debitAmount: 0,
      creditAmount: voucher.netAmount,
    });
    await manager.save(line2);

    // Line 3: Cr. Discount Received (if any)
    if (voucher.discountAmount > 0) {
      const discountAccount = await this.coaRepo.findOne({ where: { code: '4210' } }); // ส่วนลดรับ
      if (discountAccount) {
        const line3 = this.journalLineRepo.create({
          journalEntryId: savedEntry.id,
          lineNo: 3,
          accountId: discountAccount.id,
          accountCode: discountAccount.code,
          accountName: discountAccount.name,
          description: 'ส่วนลดรับ',
          debitAmount: 0,
          creditAmount: voucher.discountAmount,
        });
        await manager.save(line3);
      }
    }

    // Line 4: Cr. WHT Payable (if any)
    if (voucher.withholdingTax > 0) {
      const whtAccount = await this.coaRepo.findOne({ where: { code: '2130' } }); // ภาษี ณ ที่จ่ายค้างจ่าย
      if (whtAccount) {
        const line4 = this.journalLineRepo.create({
          journalEntryId: savedEntry.id,
          lineNo: 4,
          accountId: whtAccount.id,
          accountCode: whtAccount.code,
          accountName: whtAccount.name,
          description: 'ภาษีหัก ณ ที่จ่าย',
          debitAmount: 0,
          creditAmount: voucher.withholdingTax,
        });
        await manager.save(line4);
      }
    }

    return savedEntry;
  }

  async cancel(id: number, reason: string, userId?: number): Promise<PaymentVoucherEntity> {
    const voucher = await this.findById(id);

    if (voucher.status === PaymentStatus.CANCELLED) {
      throw new BadRequestException('Payment voucher is already cancelled');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Reverse outstanding updates
      for (const item of voucher.items) {
        const outstanding = await this.outstandingRepo.findOne({
          where: { 
            docId: item.referenceId, 
            type: OutstandingType.AP,
            docType: item.referenceType,
          },
        });

        if (outstanding) {
          outstanding.paidAmount = Number(outstanding.paidAmount) - Number(item.paymentAmount);
          outstanding.outstandingAmount = Number(outstanding.originalAmount) - Number(outstanding.paidAmount);
          outstanding.status = outstanding.outstandingAmount >= outstanding.originalAmount 
            ? OutstandingStatus.OPEN 
            : OutstandingStatus.PARTIAL;
          outstanding.fullyPaidAt = null;

          await queryRunner.manager.save(outstanding);
        }
      }

      // Cancel journal entry if exists
      if (voucher.journalEntryId) {
        const journal = await this.journalRepo.findOne({ where: { id: voucher.journalEntryId } });
        if (journal) {
          journal.status = JournalStatus.CANCELLED;
          journal.cancelledAt = new Date();
          journal.cancelledBy = userId;
          journal.cancelReason = reason;
          await queryRunner.manager.save(journal);
        }
      }

      // Update voucher
      voucher.status = PaymentStatus.CANCELLED;
      voucher.cancelledAt = new Date();
      voucher.cancelledBy = userId;
      voucher.cancelReason = reason;
      voucher.updatedBy = userId;

      await queryRunner.manager.save(voucher);

      await queryRunner.commitTransaction();

      // Audit Log
      await this.auditLogService.log({
        module: 'PAYMENT_VOUCHER',
        action: 'CANCEL',
        documentId: voucher.id,
        documentNo: voucher.docNo,
        userId: userId || 0,
        details: { reason },
      });

      return this.findById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number, userId?: number): Promise<void> {
    const voucher = await this.findById(id);

    if (voucher.status !== PaymentStatus.DRAFT) {
      throw new BadRequestException('Can only delete DRAFT payment vouchers');
    }

    // Audit Log
    await this.auditLogService.log({
      module: 'PAYMENT_VOUCHER',
      action: 'DELETE',
      documentId: voucher.id,
      documentNo: voucher.docNo,
      userId: userId || 0,
      details: { supplierName: voucher.supplierName },
    });

    await this.voucherRepo.remove(voucher);
  }
}
