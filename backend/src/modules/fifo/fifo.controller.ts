import { Controller, Get, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FifoService } from './fifo.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditContext } from '../stock-issue/stock-issue.service';

function getAuditContext(req: any): AuditContext {
  return {
    userId: req.user?.sub || req.user?.id,
    userName: req.user?.fullName || req.user?.username,
    ipAddress: req.ip || req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
  };
}

@ApiTags('FIFO & Stock')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/stock')
export class FifoController {
  constructor(
    private readonly fifoService: FifoService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get('balance')
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  async getBalance(
    @Query('productId') productId?: number,
    @Query('warehouseId') warehouseId?: number,
    @Request() req?: any,
  ) {
    const result = await this.fifoService.getStockBalance(productId, warehouseId);
    
    // Log VIEW action
    const ctx = getAuditContext(req);
    await this.auditLogService.log({
      module: 'STOCK_BALANCE',
      action: 'VIEW',
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { 
        filter: { productId, warehouseId },
        count: Array.isArray(result) ? result.length : 1,
      },
    });
    
    return result;
  }

  @Get('fifo-layers')
  @ApiQuery({ name: 'productId', required: true })
  @ApiQuery({ name: 'warehouseId', required: false })
  getFifoLayers(
    @Query('productId', ParseIntPipe) productId: number,
    @Query('warehouseId') warehouseId?: number,
  ) {
    return this.fifoService.getFifoLayers(productId, warehouseId);
  }
}
