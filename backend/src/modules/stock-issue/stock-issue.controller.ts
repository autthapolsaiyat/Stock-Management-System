import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StockIssueService } from './stock-issue.service';

@ApiTags('Stock Issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-issues')
export class StockIssueController {
  constructor(private readonly issueService: StockIssueService) {}

  @Get()
  findAll(@Query('status') status?: string) { return this.issueService.findAll(status); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.issueService.findOne(id); }

  @Post()
  create(@Body() dto: any, @Request() req: any) { return this.issueService.create(dto, req.user.sub); }

  @Post(':id/post')
  post(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.issueService.post(id, req.user.sub); }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.issueService.cancel(id, req.user.sub); }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) { return this.issueService.delete(id); }
}
