import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaymentReceiptEntity, PaymentStatus, PaymentMethod } from '../entities/payment-receipt.entity';
import { PaymentReceiptItemEntity } from '../entities/payment-receipt-item.entity';
import { ArApOutstandingEntity, OutstandingType, OutstandingStatus } from '../entities/ar-ap-outstanding.entity';
import { ChartOfAccountEntity } from '../entities/chart-of-account.entity';
import { BankAccountEntity } from '../entities/bank-account.entity';
import { JournalEntryEntity, JournalType, JournalStatus, ReferenceType } from '../entities/journal-entry.entity';
import { JournalEntryLineEntity } from '../entities/journal-entry-line.entity';
import { CreatePaymentReceiptDto } from '../dto/payment.dto';
import { DocNumberingService } from '../../doc-numbering/doc-numbering.service';

@Injectable()
export class PaymentReceiptService {
  constructor(
    @InjectRepository(PaymentReceiptEntity)
    private receiptRepo: Repository<PaymentReceiptEntity>,
    @InjectRepository(PaymentReceiptItemEntity)
    private itemRepo: Repository<PaymentReceiptItemEntity>,
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
  ) {}

  async findAll(params?: {
    customerId?: number;
    startDate?: string;
    endDate?: string;
    status?: PaymentStatus;
  }): Promise<PaymentReceiptEntity[]> {
    const query = this.receiptRepo.createQueryBuilder('pr')
      .leftJoinAndSelect('pr.items', 'items')
      .orderBy('pr.docDate', 'DESC')
      .addOrderBy('pr.docNo', 'DESC');

    if (params?.customerId) {
      query.andWhere('pr.customerId = :customerId', { customerId: params.customerId });
    }

    if (params?.startDate && params?.endDate) {
      query.andWhere('pr.docDate BETWEEN :startDate AND :endDate', {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    }

    if (params?.status) {
      query.andWhere('pr.status = :status', { status: params.status });
    }

    return query.getMany();
  }

  async findById(id: number): Promise<PaymentReceiptEntity> {
    const receipt = await this.receiptRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!receipt) {
      throw new NotFoundException(`Payment Receipt with ID ${id} not found`);
    }
    return receipt;
  }

  async getCustomerOutstanding(customerId: number): Promise<ArApOutstandingEntity[]> {
    return this.outstandingRepo.find({
      where: {
        type: OutstandingType.AR,
        partnerId: customerId,
        status: OutstandingStatus.OPEN,
      },
      order: { docDate: 'ASC' },
    });
  }

  async create(dto: CreatePaymentReceiptDto, userId?: number): Promise<PaymentReceiptEntity> {
    const docDate = new Date(dto.docDate);
    const { docNo } = await this.docNumberingService.generateDocNumber('RC');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get customer info from first outstanding item
      let customerCode = '';
      let customerName = '';

      // Calculate totals
      let totalAmount = 0;
      let totalDiscount = 0;
      let totalWHT = 0;

      const itemsData: any[] = [];

      for (const itemDto of dto.items) {
        // Get outstanding record
        const outstanding = await this.outstandingRepo.findOne({
          where: { docId: itemDto.invoiceId, type: OutstandingType.AR },
        });

        if (!outstanding) {
          throw new BadRequestException(`Invoice ID ${itemDto.invoiceId} not found in outstanding`);
        }

        if (outstanding.outstandingAmount < itemDto.paymentAmount) {
          throw new BadRequestException(`Payment amount exceeds outstanding for invoice ${outstanding.docNo}`);
        }

        if (!customerCode) {
          customerCode = outstanding.partnerCode;
          customerName = outstanding.partnerName;
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
          invoiceId: itemDto.invoiceId,
          invoiceDocNo: outstanding.docNo,
          invoiceDate: outstanding.docDate,
          invoiceDueDate: outstanding.dueDate,
          invoiceAmount: outstanding.originalAmount,
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

      // Create receipt
      const receipt = this.receiptRepo.create({
        docNo,
        docDate,
        customerId: dto.customerId,
        customerCode,
        customerName,
        paymentMethod: dto.paymentMethod,
        bankAccountId: dto.bankAccountId,
        bankAccountName,
        chequeNo: dto.chequeNo,
        chequeDate: dto.chequeDate ? new Date(dto.chequeDate) : null,
        chequeBank: dto.chequeBank,
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

      const savedReceipt = await queryRunner.manager.save(receipt);

      // Create items
      for (const itemData of itemsData) {
        const item = this.itemRepo.create({
          paymentReceiptId: savedReceipt.id,
          ...itemData,
        });
        await queryRunner.manager.save(item);
      }

      await queryRunner.commitTransaction();
      return this.findById(savedReceipt.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async post(id: number, userId?: number): Promise<PaymentReceiptEntity> {
    const receipt = await this.findById(id);

    if (receipt.status !== PaymentStatus.DRAFT) {
      throw new BadRequestException('Can only post DRAFT payment receipts');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update outstanding records
      for (const item of receipt.items) {
        const outstanding = await this.outstandingRepo.findOne({
          where: { docId: item.invoiceId, type: OutstandingType.AR },
        });

        if (outstanding) {
          outstanding.paidAmount = Number(outstanding.paidAmount) + Number(item.paymentAmount);
          outstanding.outstandingAmount = Number(outstanding.originalAmount) - Number(outstanding.paidAmount);
          outstanding.discountAmount = Number(outstanding.discountAmount || 0) + Number(item.discountAmount || 0);
          outstanding.withholdingTax = Number(outstanding.withholdingTax || 0) + Number(item.withholdingTax || 0);
          outstanding.lastPaymentDate = receipt.docDate;
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
      const journalEntry = await this.createJournalEntry(receipt, queryRunner.manager, userId);

      // Update receipt
      receipt.status = PaymentStatus.POSTED;
      receipt.postedAt = new Date();
      receipt.postedBy = userId;
      receipt.journalEntryId = journalEntry.id;
      receipt.journalDocNo = journalEntry.docNo;
      receipt.updatedBy = userId;

      await queryRunner.manager.save(receipt);

      await queryRunner.commitTransaction();
      return this.findById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createJournalEntry(receipt: PaymentReceiptEntity, manager: any, userId?: number): Promise<JournalEntryEntity> {
    // Get default accounts
    const arAccount = await this.coaRepo.findOne({ where: { isDefaultAR: true } });
    let cashBankAccount: ChartOfAccountEntity;

    if (receipt.bankAccountId) {
      const bank = await this.bankRepo.findOne({ 
        where: { id: receipt.bankAccountId },
        relations: ['chartOfAccount'],
      });
      cashBankAccount = bank?.chartOfAccount;
    }

    if (!cashBankAccount) {
      // Use default cash account
      cashBankAccount = await this.coaRepo.findOne({ where: { code: '1111' } }); // เงินสด
    }

    if (!arAccount || !cashBankAccount) {
      throw new BadRequestException('Default accounts not configured');
    }

    const { docNo } = await this.docNumberingService.generateDocNumber('JV');
    const docDate = receipt.docDate;

    const entry = this.journalRepo.create({
      docNo,
      journalType: JournalType.CASH_RECEIPT,
      docDate,
      postingDate: docDate,
      periodMonth: docDate.getMonth() + 1,
      periodYear: docDate.getFullYear(),
      description: `รับชำระเงิน - ${receipt.docNo} จาก ${receipt.customerName}`,
      referenceType: ReferenceType.PAYMENT_RECEIPT,
      referenceId: receipt.id,
      referenceDocNo: receipt.docNo,
      totalDebit: receipt.netAmount,
      totalCredit: receipt.netAmount,
      status: JournalStatus.POSTED,
      isAutoGenerated: true,
      postedAt: new Date(),
      postedBy: userId,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedEntry = await manager.save(entry);

    // Line 1: Dr. Cash/Bank
    const line1 = this.journalLineRepo.create({
      journalEntryId: savedEntry.id,
      lineNo: 1,
      accountId: cashBankAccount.id,
      accountCode: cashBankAccount.code,
      accountName: cashBankAccount.name,
      description: `รับเงิน - ${receipt.paymentMethod}`,
      debitAmount: receipt.netAmount,
      creditAmount: 0,
    });
    await manager.save(line1);

    // Line 2: Cr. AR
    const line2 = this.journalLineRepo.create({
      journalEntryId: savedEntry.id,
      lineNo: 2,
      accountId: arAccount.id,
      accountCode: arAccount.code,
      accountName: arAccount.name,
      description: `ตัดลูกหนี้ - ${receipt.customerName}`,
      debitAmount: 0,
      creditAmount: receipt.totalAmount,
      partnerType: 'CUSTOMER',
      partnerId: receipt.customerId,
      partnerName: receipt.customerName,
    });
    await manager.save(line2);

    // Line 3: Dr. Discount (if any)
    if (receipt.discountAmount > 0) {
      const discountAccount = await this.coaRepo.findOne({ where: { code: '5210' } }); // ส่วนลดจ่าย
      if (discountAccount) {
        const line3 = this.journalLineRepo.create({
          journalEntryId: savedEntry.id,
          lineNo: 3,
          accountId: discountAccount.id,
          accountCode: discountAccount.code,
          accountName: discountAccount.name,
          description: 'ส่วนลดเงินสด',
          debitAmount: receipt.discountAmount,
          creditAmount: 0,
        });
        await manager.save(line3);
      }
    }

    // Line 4: Dr. WHT (if any)
    if (receipt.withholdingTax > 0) {
      const whtAccount = await this.coaRepo.findOne({ where: { code: '1150' } }); // ภาษีถูกหัก ณ ที่จ่าย
      if (whtAccount) {
        const line4 = this.journalLineRepo.create({
          journalEntryId: savedEntry.id,
          lineNo: 4,
          accountId: whtAccount.id,
          accountCode: whtAccount.code,
          accountName: whtAccount.name,
          description: 'ภาษีหัก ณ ที่จ่าย',
          debitAmount: receipt.withholdingTax,
          creditAmount: 0,
        });
        await manager.save(line4);
      }
    }

    // Update totals
    savedEntry.totalDebit = Number(receipt.netAmount) + Number(receipt.discountAmount || 0) + Number(receipt.withholdingTax || 0);
    savedEntry.totalCredit = receipt.totalAmount;
    await manager.save(savedEntry);

    return savedEntry;
  }

  async cancel(id: number, reason: string, userId?: number): Promise<PaymentReceiptEntity> {
    const receipt = await this.findById(id);

    if (receipt.status === PaymentStatus.CANCELLED) {
      throw new BadRequestException('Payment receipt is already cancelled');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Reverse outstanding updates
      for (const item of receipt.items) {
        const outstanding = await this.outstandingRepo.findOne({
          where: { docId: item.invoiceId, type: OutstandingType.AR },
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
      if (receipt.journalEntryId) {
        const journal = await this.journalRepo.findOne({ where: { id: receipt.journalEntryId } });
        if (journal) {
          journal.status = JournalStatus.CANCELLED;
          journal.cancelledAt = new Date();
          journal.cancelledBy = userId;
          journal.cancelReason = reason;
          await queryRunner.manager.save(journal);
        }
      }

      // Update receipt
      receipt.status = PaymentStatus.CANCELLED;
      receipt.cancelledAt = new Date();
      receipt.cancelledBy = userId;
      receipt.cancelReason = reason;
      receipt.updatedBy = userId;

      await queryRunner.manager.save(receipt);

      await queryRunner.commitTransaction();
      return this.findById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<void> {
    const receipt = await this.findById(id);

    if (receipt.status !== PaymentStatus.DRAFT) {
      throw new BadRequestException('Can only delete DRAFT payment receipts');
    }

    await this.receiptRepo.remove(receipt);
  }
}
