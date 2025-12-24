import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StockTransferService } from './stock-transfer.service';
import { AuditContext } from '../stock-issue/stock-issue.service';

function getAuditContext(req: any): AuditContext {
  return {
    userId: req.user?.sub || req.user?.id,
    userName: req.user?.fullName || req.user?.username,
    ipAddress: req.ip || req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
  };
}

@ApiTags('Stock Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/stock-transfers')
export class StockTransferController {
  constructor(private readonly transferService: StockTransferService) {}

  @Get()
  findAll(@Query('status') status: string, @Request() req: any) {
    return this.transferService.findAll(status, getAuditContext(req));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.transferService.findOne(id, getAuditContext(req));
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.transferService.create(dto, getAuditContext(req));
  }

  @Post(':id/post')
  post(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.transferService.post(id, getAuditContext(req));
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.transferService.cancel(id, getAuditContext(req));
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.transferService.delete(id, getAuditContext(req));
  }
}
