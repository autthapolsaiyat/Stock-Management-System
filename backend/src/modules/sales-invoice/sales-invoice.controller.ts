import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SalesInvoiceService } from './sales-invoice.service';

@ApiTags('Sales Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sales-invoices')
export class SalesInvoiceController {
  constructor(private readonly invoiceService: SalesInvoiceService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    return this.invoiceService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.findOne(id);
  }

  @Get('quotation/:quotationId')
  findByQuotation(@Param('quotationId', ParseIntPipe) quotationId: number) {
    return this.invoiceService.findByQuotation(quotationId);
  }

  @Get(':id/profit-report')
  getProfitReport(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.getProfitReport(id);
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.invoiceService.create(dto, req.user.sub);
  }

  @Post('from-quotation/:quotationId')
  createFromQuotation(
    @Param('quotationId', ParseIntPipe) quotationId: number,
    @Body() dto: any,
    @Request() req: any,
  ) {
    return this.invoiceService.createFromQuotation(quotationId, dto, req.user.sub);
  }

  @Post(':id/approve-variance')
  approvePriceVariance(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.invoiceService.approvePriceVariance(id, req.user.sub);
  }

  @Post(':id/post')
  post(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.invoiceService.post(id, req.user.sub);
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string, @Request() req: any) {
    return this.invoiceService.cancel(id, req.user.sub, reason);
  }

  @Post(':id/mark-paid')
  markPaid(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Request() req: any) {
    return this.invoiceService.markPaid(id, req.user.sub, dto);
  }

  @Post(':id/credit-note')
  createCreditNote(@Param('id', ParseIntPipe) id: number, @Body() dto: { reason: string }, @Request() req: any) {
    return this.invoiceService.createCreditNote(id, req.user.sub, dto);
  }
}
