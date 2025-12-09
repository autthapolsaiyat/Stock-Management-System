import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoodsReceiptService } from './goods-receipt.service';

@ApiTags('Goods Receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goods-receipts')
export class GoodsReceiptController {
  constructor(private readonly grnService: GoodsReceiptService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) { return this.grnService.findAll(status); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.grnService.findOne(id); }

  @Post()
  create(@Body() dto: any, @Request() req: any) { return this.grnService.create(dto, req.user.sub); }

  @Post(':id/post')
  post(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.grnService.post(id, req.user.sub); }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.grnService.cancel(id, req.user.sub); }
}
