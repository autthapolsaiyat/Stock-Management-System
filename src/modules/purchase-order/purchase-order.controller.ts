import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PurchaseOrderService } from './purchase-order.service';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly poService: PurchaseOrderService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) { return this.poService.findAll(status); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.poService.findOne(id); }

  @Post()
  create(@Body() dto: any, @Request() req: any) { return this.poService.create(dto, req.user.sub); }

  @Post(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.poService.approve(id, req.user.sub); }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.poService.cancel(id, req.user.sub); }
}
