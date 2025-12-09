import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FifoService } from './fifo.service';

@ApiTags('FIFO & Stock')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock')
export class FifoController {
  constructor(private readonly fifoService: FifoService) {}

  @Get('balance')
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  getBalance(
    @Query('productId') productId?: number,
    @Query('warehouseId') warehouseId?: number,
  ) {
    return this.fifoService.getStockBalance(productId, warehouseId);
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
}
