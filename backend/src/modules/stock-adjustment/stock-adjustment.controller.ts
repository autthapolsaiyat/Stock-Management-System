import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { StockAdjustmentService } from './stock-adjustment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditContext } from '../stock-issue/stock-issue.service';

function getAuditContext(req: any): AuditContext {
  return {
    userId: req.user?.sub || req.user?.id,
    userName: req.user?.fullName || req.user?.username,
    ipAddress: req.ip || req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
  };
}

@Controller('stock-adjustments')
@UseGuards(JwtAuthGuard)
export class StockAdjustmentController {
  constructor(private readonly stockAdjustmentService: StockAdjustmentService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.stockAdjustmentService.findAll(getAuditContext(req));
  }

  @Get('products')
  getProductsForAdjustment(@Query('warehouseId') warehouseId: string) {
    return this.stockAdjustmentService.getProductsForAdjustment(Number(warehouseId));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.stockAdjustmentService.findOne(Number(id), getAuditContext(req));
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.stockAdjustmentService.create(dto, getAuditContext(req));
  }

  @Post(':id/post')
  post(@Param('id') id: string, @Request() req: any) {
    return this.stockAdjustmentService.post(Number(id), getAuditContext(req));
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.stockAdjustmentService.cancel(Number(id), getAuditContext(req));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.stockAdjustmentService.delete(Number(id), getAuditContext(req));
  }
}
