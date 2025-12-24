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
@Controller('stock')
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

  @Get('card')
  @ApiQuery({ name: 'productId', required: true })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getStockCard(
    @Query('productId', ParseIntPipe) productId: number,
    @Query('warehouseId') warehouseId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?: any,
  ) {
    const result = await this.fifoService.getStockCard(productId, warehouseId, startDate, endDate);
    
    // Log VIEW action
    const ctx = getAuditContext(req);
    await this.auditLogService.log({
      module: 'STOCK_CARD',
      action: 'VIEW',
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { 
        filter: { productId, warehouseId, startDate, endDate },
        transactionCount: result.transactions?.length || 0,
      },
    });
    
    return result;
  }

  @Get('valuation')
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'asOfDate', required: false })
  async getStockValuation(
    @Query('warehouseId') warehouseId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('asOfDate') asOfDate?: string,
    @Request() req?: any,
  ) {
    const result = await this.fifoService.getStockValuation(
      warehouseId ? Number(warehouseId) : undefined,
      categoryId ? Number(categoryId) : undefined,
      asOfDate,
    );
    
    // Log VIEW action
    const ctx = getAuditContext(req);
    await this.auditLogService.log({
      module: 'STOCK_VALUATION',
      action: 'VIEW',
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { 
        filter: { warehouseId, categoryId, asOfDate },
        totalItems: result.summary?.totalItems || 0,
        totalValue: result.summary?.totalValue || 0,
      },
    });
    
    return result;
  }

  @Get('movement')
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async getStockMovement(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('warehouseId') warehouseId?: number,
    @Query('categoryId') categoryId?: number,
    @Request() req?: any,
  ) {
    const result = await this.fifoService.getStockMovement(
      startDate,
      endDate,
      warehouseId ? Number(warehouseId) : undefined,
      categoryId ? Number(categoryId) : undefined,
    );
    
    // Log VIEW action
    const ctx = getAuditContext(req);
    await this.auditLogService.log({
      module: 'STOCK_MOVEMENT',
      action: 'VIEW',
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { 
        filter: { startDate, endDate, warehouseId, categoryId },
        totalItems: result.summary?.totalItems || 0,
      },
    });
    
    return result;
  }

  @Get('reorder-alerts')
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async getReorderAlerts(
    @Query('warehouseId') warehouseId?: number,
    @Query('categoryId') categoryId?: number,
    @Request() req?: any,
  ) {
    const result = await this.fifoService.getReorderAlerts(
      warehouseId ? Number(warehouseId) : undefined,
      categoryId ? Number(categoryId) : undefined,
    );
    
    // Log VIEW action
    const ctx = getAuditContext(req);
    await this.auditLogService.log({
      module: 'REORDER_ALERT',
      action: 'VIEW',
      userId: ctx.userId,
      userName: ctx.userName,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      details: { 
        filter: { warehouseId, categoryId },
        totalAlerts: result.summary?.totalAlerts || 0,
      },
    });
    
    return result;
  }
}
