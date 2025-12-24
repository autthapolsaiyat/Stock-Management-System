import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll(
    @Query('module') module?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.auditLogService.findAll({
      module,
      action,
      userId: userId ? parseInt(userId) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : 100,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  @Get('export')
  async exportCsv(
    @Res() res: Response,
    @Query('module') module?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const csv = await this.auditLogService.exportToCsv({
      module,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8
  }

  @Get('modules')
  getModules() {
    return [
      { value: 'STOCK_ISSUE', label: 'เบิกสินค้า' },
      { value: 'STOCK_TRANSFER', label: 'โอนสินค้า' },
      { value: 'STOCK_ADJUSTMENT', label: 'ปรับปรุงสต็อก' },
      { value: 'STOCK_COUNT', label: 'นับสต็อก' },
      { value: 'STOCK_BALANCE', label: 'ยอดคงเหลือ' },
      { value: 'QUOTATION', label: 'ใบเสนอราคา' },
      { value: 'PURCHASE_ORDER', label: 'ใบสั่งซื้อ' },
      { value: 'GOODS_RECEIPT', label: 'ใบรับสินค้า' },
      { value: 'SALES_INVOICE', label: 'ใบขายสินค้า' },
      { value: 'AUTH', label: 'การยืนยันตัวตน' },
      { value: 'USER', label: 'ผู้ใช้งาน' },
    ];
  }

  @Get('actions')
  getActions() {
    return [
      { value: 'VIEW', label: 'ดู' },
      { value: 'CREATE', label: 'สร้าง' },
      { value: 'UPDATE', label: 'แก้ไข' },
      { value: 'DELETE', label: 'ลบ' },
      { value: 'POST', label: 'ผ่านรายการ' },
      { value: 'CANCEL', label: 'ยกเลิก' },
      { value: 'APPROVE', label: 'อนุมัติ' },
      { value: 'REJECT', label: 'ปฏิเสธ' },
      { value: 'EXPORT', label: 'ส่งออก' },
      { value: 'LOGIN', label: 'เข้าสู่ระบบ' },
      { value: 'LOGOUT', label: 'ออกจากระบบ' },
    ];
  }
}
