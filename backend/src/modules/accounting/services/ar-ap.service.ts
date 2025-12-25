import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ArApOutstandingEntity, OutstandingType, OutstandingStatus } from '../entities/ar-ap-outstanding.entity';

@Injectable()
export class ArApService {
  constructor(
    @InjectRepository(ArApOutstandingEntity)
    private outstandingRepo: Repository<ArApOutstandingEntity>,
  ) {}

  // ==================== AR (ลูกหนี้) ====================

  async getAROutstanding(params?: {
    customerId?: number;
    status?: OutstandingStatus;
  }): Promise<ArApOutstandingEntity[]> {
    const query = this.outstandingRepo.createQueryBuilder('o')
      .where('o.type = :type', { type: OutstandingType.AR })
      .orderBy('o.dueDate', 'ASC');

    if (params?.customerId) {
      query.andWhere('o.partnerId = :partnerId', { partnerId: params.customerId });
    }

    if (params?.status) {
      query.andWhere('o.status = :status', { status: params.status });
    } else {
      query.andWhere('o.status != :cancelled', { cancelled: OutstandingStatus.CANCELLED });
    }

    return query.getMany();
  }

  async getARAgingReport(asOfDate: string): Promise<any> {
    const date = new Date(asOfDate);
    
    const outstanding = await this.outstandingRepo.find({
      where: {
        type: OutstandingType.AR,
        status: OutstandingStatus.OPEN,
      },
    });

    // Calculate aging buckets
    const agingData: any = {};

    for (const item of outstanding) {
      const dueDate = new Date(item.dueDate);
      const diffDays = Math.floor((date.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let bucket: string;
      if (diffDays <= 0) {
        bucket = 'CURRENT';
      } else if (diffDays <= 30) {
        bucket = '1-30';
      } else if (diffDays <= 60) {
        bucket = '31-60';
      } else if (diffDays <= 90) {
        bucket = '61-90';
      } else {
        bucket = '90+';
      }

      const key = `${item.partnerId}-${item.partnerName}`;
      if (!agingData[key]) {
        agingData[key] = {
          partnerId: item.partnerId,
          partnerCode: item.partnerCode,
          partnerName: item.partnerName,
          CURRENT: 0,
          '1-30': 0,
          '31-60': 0,
          '61-90': 0,
          '90+': 0,
          total: 0,
        };
      }

      agingData[key][bucket] += Number(item.outstandingAmount);
      agingData[key].total += Number(item.outstandingAmount);
    }

    // Calculate totals
    const totals = {
      CURRENT: 0,
      '1-30': 0,
      '31-60': 0,
      '61-90': 0,
      '90+': 0,
      total: 0,
    };

    const details = Object.values(agingData);
    for (const row of details as any[]) {
      totals.CURRENT += row.CURRENT;
      totals['1-30'] += row['1-30'];
      totals['31-60'] += row['31-60'];
      totals['61-90'] += row['61-90'];
      totals['90+'] += row['90+'];
      totals.total += row.total;
    }

    return {
      asOfDate,
      details,
      totals,
    };
  }

  async getARSummaryByCustomer(): Promise<any[]> {
    const result = await this.outstandingRepo.createQueryBuilder('o')
      .select('o.partnerId', 'customerId')
      .addSelect('o.partnerCode', 'customerCode')
      .addSelect('o.partnerName', 'customerName')
      .addSelect('SUM(o.originalAmount)', 'totalInvoiced')
      .addSelect('SUM(o.paidAmount)', 'totalPaid')
      .addSelect('SUM(o.outstandingAmount)', 'totalOutstanding')
      .addSelect('COUNT(*)', 'invoiceCount')
      .where('o.type = :type', { type: OutstandingType.AR })
      .andWhere('o.status != :cancelled', { cancelled: OutstandingStatus.CANCELLED })
      .groupBy('o.partnerId')
      .addGroupBy('o.partnerCode')
      .addGroupBy('o.partnerName')
      .orderBy('SUM(o.outstandingAmount)', 'DESC')
      .getRawMany();

    return result.map(r => ({
      ...r,
      totalInvoiced: Number(r.totalInvoiced) || 0,
      totalPaid: Number(r.totalPaid) || 0,
      totalOutstanding: Number(r.totalOutstanding) || 0,
      invoiceCount: Number(r.invoiceCount) || 0,
    }));
  }

  // ==================== AP (เจ้าหนี้) ====================

  async getAPOutstanding(params?: {
    supplierId?: number;
    status?: OutstandingStatus;
  }): Promise<ArApOutstandingEntity[]> {
    const query = this.outstandingRepo.createQueryBuilder('o')
      .where('o.type = :type', { type: OutstandingType.AP })
      .orderBy('o.dueDate', 'ASC');

    if (params?.supplierId) {
      query.andWhere('o.partnerId = :partnerId', { partnerId: params.supplierId });
    }

    if (params?.status) {
      query.andWhere('o.status = :status', { status: params.status });
    } else {
      query.andWhere('o.status != :cancelled', { cancelled: OutstandingStatus.CANCELLED });
    }

    return query.getMany();
  }

  async getAPAgingReport(asOfDate: string): Promise<any> {
    const date = new Date(asOfDate);
    
    const outstanding = await this.outstandingRepo.find({
      where: {
        type: OutstandingType.AP,
        status: OutstandingStatus.OPEN,
      },
    });

    const agingData: any = {};

    for (const item of outstanding) {
      const dueDate = new Date(item.dueDate);
      const diffDays = Math.floor((date.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let bucket: string;
      if (diffDays <= 0) {
        bucket = 'CURRENT';
      } else if (diffDays <= 30) {
        bucket = '1-30';
      } else if (diffDays <= 60) {
        bucket = '31-60';
      } else if (diffDays <= 90) {
        bucket = '61-90';
      } else {
        bucket = '90+';
      }

      const key = `${item.partnerId}-${item.partnerName}`;
      if (!agingData[key]) {
        agingData[key] = {
          partnerId: item.partnerId,
          partnerCode: item.partnerCode,
          partnerName: item.partnerName,
          CURRENT: 0,
          '1-30': 0,
          '31-60': 0,
          '61-90': 0,
          '90+': 0,
          total: 0,
        };
      }

      agingData[key][bucket] += Number(item.outstandingAmount);
      agingData[key].total += Number(item.outstandingAmount);
    }

    const totals = {
      CURRENT: 0,
      '1-30': 0,
      '31-60': 0,
      '61-90': 0,
      '90+': 0,
      total: 0,
    };

    const details = Object.values(agingData);
    for (const row of details as any[]) {
      totals.CURRENT += row.CURRENT;
      totals['1-30'] += row['1-30'];
      totals['31-60'] += row['31-60'];
      totals['61-90'] += row['61-90'];
      totals['90+'] += row['90+'];
      totals.total += row.total;
    }

    return {
      asOfDate,
      details,
      totals,
    };
  }

  async getAPSummaryBySupplier(): Promise<any[]> {
    const result = await this.outstandingRepo.createQueryBuilder('o')
      .select('o.partnerId', 'supplierId')
      .addSelect('o.partnerCode', 'supplierCode')
      .addSelect('o.partnerName', 'supplierName')
      .addSelect('SUM(o.originalAmount)', 'totalPurchased')
      .addSelect('SUM(o.paidAmount)', 'totalPaid')
      .addSelect('SUM(o.outstandingAmount)', 'totalOutstanding')
      .addSelect('COUNT(*)', 'documentCount')
      .where('o.type = :type', { type: OutstandingType.AP })
      .andWhere('o.status != :cancelled', { cancelled: OutstandingStatus.CANCELLED })
      .groupBy('o.partnerId')
      .addGroupBy('o.partnerCode')
      .addGroupBy('o.partnerName')
      .orderBy('SUM(o.outstandingAmount)', 'DESC')
      .getRawMany();

    return result.map(r => ({
      ...r,
      totalPurchased: Number(r.totalPurchased) || 0,
      totalPaid: Number(r.totalPaid) || 0,
      totalOutstanding: Number(r.totalOutstanding) || 0,
      documentCount: Number(r.documentCount) || 0,
    }));
  }

  // ==================== CREATE OUTSTANDING ====================

  async createARFromInvoice(
    invoiceId: number,
    invoiceDocNo: string,
    docDate: Date,
    dueDate: Date,
    customerId: number,
    customerCode: string,
    customerName: string,
    amount: number,
    creditTermDays: number,
  ): Promise<ArApOutstandingEntity> {
    const outstanding = this.outstandingRepo.create({
      type: OutstandingType.AR,
      partnerId: customerId,
      partnerCode: customerCode,
      partnerName: customerName,
      docType: 'SALES_INVOICE',
      docId: invoiceId,
      docNo: invoiceDocNo,
      docDate,
      dueDate,
      creditTermDays,
      originalAmount: amount,
      paidAmount: 0,
      outstandingAmount: amount,
      status: OutstandingStatus.OPEN,
    });

    return this.outstandingRepo.save(outstanding);
  }

  async createAPFromGR(
    grId: number,
    grDocNo: string,
    docDate: Date,
    dueDate: Date,
    supplierId: number,
    supplierCode: string,
    supplierName: string,
    amount: number,
    creditTermDays: number,
  ): Promise<ArApOutstandingEntity> {
    const outstanding = this.outstandingRepo.create({
      type: OutstandingType.AP,
      partnerId: supplierId,
      partnerCode: supplierCode,
      partnerName: supplierName,
      docType: 'GOODS_RECEIPT',
      docId: grId,
      docNo: grDocNo,
      docDate,
      dueDate,
      creditTermDays,
      originalAmount: amount,
      paidAmount: 0,
      outstandingAmount: amount,
      status: OutstandingStatus.OPEN,
    });

    return this.outstandingRepo.save(outstanding);
  }

  async cancelOutstanding(docType: string, docId: number): Promise<void> {
    await this.outstandingRepo.update(
      { docType, docId },
      { status: OutstandingStatus.CANCELLED }
    );
  }

  // ==================== DASHBOARD SUMMARY ====================

  async getDashboardSummary(): Promise<any> {
    const arTotal = await this.outstandingRepo.createQueryBuilder('o')
      .select('SUM(o.outstandingAmount)', 'total')
      .where('o.type = :type', { type: OutstandingType.AR })
      .andWhere('o.status IN (:...statuses)', { statuses: [OutstandingStatus.OPEN, OutstandingStatus.PARTIAL] })
      .getRawOne();

    const apTotal = await this.outstandingRepo.createQueryBuilder('o')
      .select('SUM(o.outstandingAmount)', 'total')
      .where('o.type = :type', { type: OutstandingType.AP })
      .andWhere('o.status IN (:...statuses)', { statuses: [OutstandingStatus.OPEN, OutstandingStatus.PARTIAL] })
      .getRawOne();

    const arOverdue = await this.outstandingRepo.createQueryBuilder('o')
      .select('SUM(o.outstandingAmount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('o.type = :type', { type: OutstandingType.AR })
      .andWhere('o.status IN (:...statuses)', { statuses: [OutstandingStatus.OPEN, OutstandingStatus.PARTIAL] })
      .andWhere('o.dueDate < :today', { today: new Date() })
      .getRawOne();

    const apOverdue = await this.outstandingRepo.createQueryBuilder('o')
      .select('SUM(o.outstandingAmount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('o.type = :type', { type: OutstandingType.AP })
      .andWhere('o.status IN (:...statuses)', { statuses: [OutstandingStatus.OPEN, OutstandingStatus.PARTIAL] })
      .andWhere('o.dueDate < :today', { today: new Date() })
      .getRawOne();

    return {
      ar: {
        totalOutstanding: Number(arTotal?.total) || 0,
        overdueAmount: Number(arOverdue?.total) || 0,
        overdueCount: Number(arOverdue?.count) || 0,
      },
      ap: {
        totalOutstanding: Number(apTotal?.total) || 0,
        overdueAmount: Number(apOverdue?.total) || 0,
        overdueCount: Number(apOverdue?.count) || 0,
      },
    };
  }
}
