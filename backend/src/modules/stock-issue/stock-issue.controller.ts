import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StockIssueService, AuditContext } from './stock-issue.service';

// Helper function สร้าง AuditContext จาก Request
function getAuditContext(req: any): AuditContext {
  return {
    userId: req.user?.sub || req.user?.id,
    userName: req.user?.fullName || req.user?.username,
    ipAddress: req.ip || req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
  };
}

@ApiTags('Stock Issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-issues')
export class StockIssueController {
  constructor(private readonly issueService: StockIssueService) {}

  @Get()
  findAll(@Query('status') status: string, @Request() req: any) {
    return this.issueService.findAll(status, getAuditContext(req));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.issueService.findOne(id, getAuditContext(req));
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.issueService.create(dto, getAuditContext(req));
  }

  @Post(':id/post')
  post(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.issueService.post(id, getAuditContext(req));
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.issueService.cancel(id, getAuditContext(req));
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.issueService.delete(id, getAuditContext(req));
  }
}
