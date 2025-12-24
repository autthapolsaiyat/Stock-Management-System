import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { AuditLogEntity } from './entities';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface LogParams {
  module: string;
  action: string;
  documentId?: number;
  documentNo?: string;
  userId: number;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async log(params: LogParams): Promise<AuditLogEntity> {
    const auditLog = this.auditLogRepository.create({
      module: params.module,
      action: params.action,
      documentId: params.documentId,
      documentNo: params.documentNo,
      userId: params.userId,
      userName: params.userName,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      details: params.details,
    });
    return this.auditLogRepository.save(auditLog);
  }

  async findAll(params?: {
    module?: string;
    action?: string;
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ data: AuditLogEntity[]; total: number }> {
    const query = this.auditLogRepository.createQueryBuilder('log');

    if (params?.module) {
      query.andWhere('log.module = :module', { module: params.module });
    }
    if (params?.action) {
      query.andWhere('log.action = :action', { action: params.action });
    }
    if (params?.userId) {
      query.andWhere('log.userId = :userId', { userId: params.userId });
    }
    if (params?.startDate) {
      query.andWhere('log.createdAt >= :startDate', { startDate: params.startDate });
    }
    if (params?.endDate) {
      query.andWhere('log.createdAt <= :endDate', { endDate: params.endDate });
    }

    query.orderBy('log.createdAt', 'DESC');

    const total = await query.getCount();
    
    if (params?.limit) {
      query.take(params.limit);
    }
    if (params?.offset) {
      query.skip(params.offset);
    }

    const data = await query.getMany();

    return { data, total };
  }

  // ลบ log เก่ากว่า 90 วัน (ตาม พ.ร.บ. คอมพิวเตอร์)
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldLogs(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    const result = await this.auditLogRepository.delete({
      createdAt: LessThan(cutoffDate),
    });

    console.log(`[AuditLog Cleanup] Deleted ${result.affected} logs older than 90 days`);
    return result.affected || 0;
  }

  // Export to CSV format
  async exportToCsv(params?: {
    module?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<string> {
    const { data } = await this.findAll({ ...params, limit: 10000 });
    
    const headers = ['ID', 'วันที่', 'โมดูล', 'การกระทำ', 'เอกสาร', 'ผู้ใช้', 'IP', 'รายละเอียด'];
    const rows = data.map(log => [
      log.id,
      new Date(log.createdAt).toISOString(),
      log.module,
      log.action,
      log.documentNo || '-',
      log.userName || log.userId,
      log.ipAddress || '-',
      log.details ? JSON.stringify(log.details) : '-',
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
