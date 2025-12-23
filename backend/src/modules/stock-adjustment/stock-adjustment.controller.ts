import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { StockAdjustmentService } from './stock-adjustment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stock-adjustments')
@UseGuards(JwtAuthGuard)
export class StockAdjustmentController {
  constructor(private readonly stockAdjustmentService: StockAdjustmentService) {}

  @Get()
  findAll() {
    return this.stockAdjustmentService.findAll();
  }

  @Get('products')
  getProductsForAdjustment(@Query('warehouseId') warehouseId: string) {
    return this.stockAdjustmentService.getProductsForAdjustment(Number(warehouseId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockAdjustmentService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.stockAdjustmentService.create(dto, req.user?.id);
  }

  @Post(':id/post')
  post(@Param('id') id: string, @Request() req: any) {
    return this.stockAdjustmentService.post(Number(id), req.user?.id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.stockAdjustmentService.cancel(Number(id), req.user?.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.stockAdjustmentService.delete(Number(id));
  }
}
