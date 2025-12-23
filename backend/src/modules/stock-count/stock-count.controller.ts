import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StockCountService } from './stock-count.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stock-counts')
@UseGuards(JwtAuthGuard)
export class StockCountController {
  constructor(private readonly stockCountService: StockCountService) {}

  @Get()
  findAll() {
    return this.stockCountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockCountService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.stockCountService.create(dto, req.user?.id);
  }

  @Post(':id/start')
  startCount(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.startCount(Number(id), req.user?.id);
  }

  @Post(':id/items/:itemId')
  updateItemCount(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: any,
    @Request() req: any
  ) {
    return this.stockCountService.updateItemCount(Number(id), Number(itemId), dto, req.user?.id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.complete(Number(id), req.user?.id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.approve(Number(id), req.user?.id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.cancel(Number(id), req.user?.id);
  }

  @Post(':id/create-adjustment')
  createAdjustment(@Param('id') id: string, @Request() req: any) {
    return this.stockCountService.createAdjustment(Number(id), req.user?.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.stockCountService.delete(Number(id));
  }
}
