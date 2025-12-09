import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SalesInvoiceService } from './sales-invoice.service';

@ApiTags('Sales Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sales-invoices')
export class SalesInvoiceController {
  constructor(private readonly invoiceService: SalesInvoiceService) {}

  @Get()
  findAll(@Query('status') status?: string) { return this.invoiceService.findAll(status); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.invoiceService.findOne(id); }

  @Post()
  create(@Body() dto: any, @Request() req: any) { return this.invoiceService.create(dto, req.user.sub); }

  @Post(':id/post')
  post(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.invoiceService.post(id, req.user.sub); }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) { return this.invoiceService.cancel(id, req.user.sub); }
}
