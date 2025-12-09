import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StockTransferService } from './stock-transfer.service';

@ApiTags('Stock Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-transfers')
export class StockTransferController {
  constructor(private readonly transferService: StockTransferService) {}

  @Get()
  findAll(@Query('status') status?: string) { return this.transferService.findAll(status); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.transferService.findOne(id); }

  @Post()
  create(@Body() dto: any, @Request() req: any) { return this.transferService.create(dto, req.user.sub); }

  @Post(':id/post')
  post(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.transferService.post(id, req.user.sub); }
}
