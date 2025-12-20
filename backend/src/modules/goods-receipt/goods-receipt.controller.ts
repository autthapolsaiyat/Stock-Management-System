import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoodsReceiptService } from './goods-receipt.service';

@ApiTags('Goods Receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goods-receipts')
export class GoodsReceiptController {
  constructor(private readonly grService: GoodsReceiptService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    return this.grService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.grService.findOne(id);
  }

  @Get('purchase-order/:poId')
  findByPO(@Param('poId', ParseIntPipe) poId: number) {
    return this.grService.findByPO(poId);
  }

  @Get('quotation/:quotationId')
  findByQuotation(@Param('quotationId', ParseIntPipe) quotationId: number) {
    return this.grService.findByQuotation(quotationId);
  }

  @Get(':id/variance-report')
  getVarianceReport(@Param('id', ParseIntPipe) id: number) {
    return this.grService.getVarianceReport(id);
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.grService.create(dto, req.user.sub);
  }

  @Post('from-po/:poId')
  createFromPO(
    @Param('poId', ParseIntPipe) poId: number,
    @Body() dto: any,
    @Request() req: any,
  ) {
    return this.grService.createFromPO(poId, dto, req.user.sub);
  }

  @Post(':id/post')
  post(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.grService.post(id, req.user.sub);
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string, @Request() req: any) {
    return this.grService.cancel(id, req.user.sub, reason);
  }

  @Post(':id/reverse')
  reverse(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string, @Request() req: any) {
    return this.grService.reverse(id, req.user.sub, reason);
  }
}
