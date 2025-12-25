import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntryLineEntity } from '../entities/journal-entry-line.entity';
import { JournalEntryEntity, JournalStatus } from '../entities/journal-entry.entity';
import { ChartOfAccountEntity, AccountType, BalanceType } from '../entities/chart-of-account.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(JournalEntryLineEntity)
    private lineRepo: Repository<JournalEntryLineEntity>,
    @InjectRepository(JournalEntryEntity)
    private journalRepo: Repository<JournalEntryEntity>,
    @InjectRepository(ChartOfAccountEntity)
    private coaRepo: Repository<ChartOfAccountEntity>,
  ) {}

  // ==================== งบทดลอง (Trial Balance) ====================
  async getTrialBalance(params: {
    startDate: string;
    endDate: string;
    showZeroBalance?: boolean;
  }): Promise<any> {
    const { startDate, endDate, showZeroBalance = false } = params;

    // Get all accounts
    const accounts = await this.coaRepo.find({
      where: { isActive: true },
      order: { code: 'ASC' },
    });

    // Get transactions for period
    const transactions = await this.lineRepo.createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'je')
      .select('line.accountId', 'accountId')
      .addSelect('SUM(line.debitAmount)', 'debit')
      .addSelect('SUM(line.creditAmount)', 'credit')
      .where('je.status = :status', { status: JournalStatus.POSTED })
      .andWhere('je.docDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('line.accountId')
      .getRawMany();

    // Create map for quick lookup
    const txMap = new Map();
    for (const tx of transactions) {
      txMap.set(tx.accountId, {
        debit: Number(tx.debit) || 0,
        credit: Number(tx.credit) || 0,
      });
    }

    // Build trial balance
    const details: any[] = [];
    let totalDebit = 0;
    let totalCredit = 0;

    for (const account of accounts) {
      const tx = txMap.get(account.id) || { debit: 0, credit: 0 };
      const balance = tx.debit - tx.credit;

      if (!showZeroBalance && balance === 0 && tx.debit === 0 && tx.credit === 0) {
        continue;
      }

      const debitBalance = balance > 0 ? balance : 0;
      const creditBalance = balance < 0 ? Math.abs(balance) : 0;

      details.push({
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        accountType: account.accountType,
        debit: tx.debit,
        credit: tx.credit,
        debitBalance,
        creditBalance,
      });

      totalDebit += debitBalance;
      totalCredit += creditBalance;
    }

    return {
      startDate,
      endDate,
      details,
      totals: {
        totalDebit,
        totalCredit,
        isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
      },
    };
  }

  // ==================== งบกำไรขาดทุน (Profit & Loss) ====================
  async getProfitAndLoss(params: {
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const { startDate, endDate } = params;

    // Get revenue accounts
    const revenueData = await this.getAccountTypeBalance(
      [AccountType.REVENUE],
      startDate,
      endDate
    );

    // Get expense accounts
    const expenseData = await this.getAccountTypeBalance(
      [AccountType.EXPENSE],
      startDate,
      endDate
    );

    const totalRevenue = revenueData.reduce((sum, r) => sum + r.balance, 0);
    const totalExpense = expenseData.reduce((sum, e) => sum + e.balance, 0);
    const netProfit = totalRevenue - totalExpense;

    return {
      startDate,
      endDate,
      revenue: {
        details: revenueData,
        total: totalRevenue,
      },
      expense: {
        details: expenseData,
        total: totalExpense,
      },
      netProfit,
      netProfitPercent: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
    };
  }

  // ==================== งบดุล (Balance Sheet) ====================
  async getBalanceSheet(params: {
    asOfDate: string;
  }): Promise<any> {
    const { asOfDate } = params;

    // Get asset accounts
    const assetData = await this.getAccountTypeBalance(
      [AccountType.ASSET],
      '1900-01-01', // From beginning
      asOfDate
    );

    // Get liability accounts
    const liabilityData = await this.getAccountTypeBalance(
      [AccountType.LIABILITY],
      '1900-01-01',
      asOfDate
    );

    // Get equity accounts
    const equityData = await this.getAccountTypeBalance(
      [AccountType.EQUITY],
      '1900-01-01',
      asOfDate
    );

    // Calculate retained earnings (accumulated P&L)
    const currentYearStart = `${asOfDate.substring(0, 4)}-01-01`;
    const pnl = await this.getProfitAndLoss({
      startDate: currentYearStart,
      endDate: asOfDate,
    });

    const totalAssets = assetData.reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = liabilityData.reduce((sum, l) => sum + Math.abs(l.balance), 0);
    const totalEquity = equityData.reduce((sum, e) => sum + Math.abs(e.balance), 0);
    const retainedEarnings = pnl.netProfit;
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity + retainedEarnings;

    return {
      asOfDate,
      assets: {
        details: assetData,
        total: totalAssets,
      },
      liabilities: {
        details: liabilityData,
        total: totalLiabilities,
      },
      equity: {
        details: equityData,
        retainedEarnings,
        total: totalEquity + retainedEarnings,
      },
      totalLiabilitiesAndEquity,
      isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01,
    };
  }

  // ==================== General Ledger ====================
  async getGeneralLedger(params: {
    accountId: number;
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const { accountId, startDate, endDate } = params;

    const account = await this.coaRepo.findOne({ where: { id: accountId } });
    if (!account) {
      throw new Error(`Account ID ${accountId} not found`);
    }

    // Get opening balance (before start date)
    const openingResult = await this.lineRepo.createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'je')
      .select('SUM(line.debitAmount) - SUM(line.creditAmount)', 'balance')
      .where('line.accountId = :accountId', { accountId })
      .andWhere('je.status = :status', { status: JournalStatus.POSTED })
      .andWhere('je.docDate < :startDate', { startDate })
      .getRawOne();

    const openingBalance = Number(openingResult?.balance) || 0;

    // Get transactions for period
    const transactions = await this.lineRepo.createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'je')
      .select([
        'je.docNo AS docNo',
        'je.docDate AS docDate',
        'je.description AS description',
        'line.description AS lineDescription',
        'line.debitAmount AS debit',
        'line.creditAmount AS credit',
        'line.partnerName AS partnerName',
      ])
      .where('line.accountId = :accountId', { accountId })
      .andWhere('je.status = :status', { status: JournalStatus.POSTED })
      .andWhere('je.docDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('je.docDate', 'ASC')
      .addOrderBy('je.docNo', 'ASC')
      .getRawMany();

    // Calculate running balance
    let runningBalance = openingBalance;
    const details = transactions.map(tx => {
      const debit = Number(tx.debit) || 0;
      const credit = Number(tx.credit) || 0;
      runningBalance += debit - credit;

      return {
        docNo: tx.docNo,
        docDate: tx.docDate,
        description: tx.lineDescription || tx.description,
        partnerName: tx.partnerName,
        debit,
        credit,
        balance: runningBalance,
      };
    });

    const totalDebit = transactions.reduce((sum, tx) => sum + (Number(tx.debit) || 0), 0);
    const totalCredit = transactions.reduce((sum, tx) => sum + (Number(tx.credit) || 0), 0);

    return {
      account: {
        id: account.id,
        code: account.code,
        name: account.name,
        accountType: account.accountType,
      },
      startDate,
      endDate,
      openingBalance,
      details,
      totals: {
        totalDebit,
        totalCredit,
        movement: totalDebit - totalCredit,
        closingBalance: runningBalance,
      },
    };
  }

  // ==================== Helper Methods ====================
  private async getAccountTypeBalance(
    accountTypes: AccountType[],
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    const accounts = await this.coaRepo.find({
      where: accountTypes.map(type => ({ accountType: type, isActive: true })),
      order: { code: 'ASC' },
    });

    const transactions = await this.lineRepo.createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'je')
      .innerJoin('line.account', 'account')
      .select('line.accountId', 'accountId')
      .addSelect('SUM(line.debitAmount)', 'debit')
      .addSelect('SUM(line.creditAmount)', 'credit')
      .where('je.status = :status', { status: JournalStatus.POSTED })
      .andWhere('je.docDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('account.accountType IN (:...types)', { types: accountTypes })
      .groupBy('line.accountId')
      .getRawMany();

    const txMap = new Map();
    for (const tx of transactions) {
      txMap.set(tx.accountId, {
        debit: Number(tx.debit) || 0,
        credit: Number(tx.credit) || 0,
      });
    }

    return accounts.map(account => {
      const tx = txMap.get(account.id) || { debit: 0, credit: 0 };
      
      // For revenue/liability/equity, balance is credit - debit
      // For asset/expense, balance is debit - credit
      let balance: number;
      if (account.balanceType === BalanceType.CREDIT) {
        balance = tx.credit - tx.debit;
      } else {
        balance = tx.debit - tx.credit;
      }

      return {
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        accountGroup: account.accountGroup,
        debit: tx.debit,
        credit: tx.credit,
        balance,
      };
    }).filter(a => a.balance !== 0 || a.debit !== 0 || a.credit !== 0);
  }

  // ==================== Dashboard Summary ====================
  async getFinancialSummary(year: number): Promise<any> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const today = new Date().toISOString().split('T')[0];

    // Get monthly P&L
    const monthlyData: any[] = [];
    for (let month = 1; month <= 12; month++) {
      const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
      const monthEnd = new Date(year, month, 0).toISOString().split('T')[0];

      if (monthStart > today) break;

      const pnl = await this.getProfitAndLoss({
        startDate: monthStart,
        endDate: monthEnd,
      });

      monthlyData.push({
        month,
        monthName: new Date(year, month - 1).toLocaleString('th-TH', { month: 'long' }),
        revenue: pnl.revenue.total,
        expense: pnl.expense.total,
        netProfit: pnl.netProfit,
      });
    }

    // Get YTD summary
    const ytdPnL = await this.getProfitAndLoss({
      startDate,
      endDate: today,
    });

    return {
      year,
      ytd: {
        revenue: ytdPnL.revenue.total,
        expense: ytdPnL.expense.total,
        netProfit: ytdPnL.netProfit,
        profitMargin: ytdPnL.netProfitPercent,
      },
      monthly: monthlyData,
    };
  }
}
