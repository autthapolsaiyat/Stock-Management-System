import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StockCountService } from './stock-count.service';
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

@Controller('api/stock-counts')
@UseGuards(JwtAuthGuard)
export class StockCountController {
  constructor(private readonly stockCountService: StockCountService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.stockCountService.findAll(getAuditContext(req));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.findOne(Number(id), getAuditContext(req));
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.stockCountService.create(dto, getAuditContext(req));
  }

  @Post(':id/start')
  startCount(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.startCount(Number(id), getAuditContext(req));
  }

  @Post(':id/items/:itemId')
  updateItemCount(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: any,
    @Request() req: any
  ) {
    return this.stockCountService.updateItemCount(Number(id), Number(itemId), dto, getAuditContext(req));
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.complete(Number(id), getAuditContext(req));
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.approve(Number(id), getAuditContext(req));
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.cancel(Number(id), getAuditContext(req));
  }

  @Post(':id/create-adjustment')
  createAdjustment(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.createAdjustment(Number(id), getAuditContext(req));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.delete(Number(id), getAuditContext(req));
  }
}
