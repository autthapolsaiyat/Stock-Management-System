import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuotationService } from './quotation.service';

@ApiTags('Quotations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'qtType', required: false })
  findAll(@Query('status') status?: string, @Query('qtType') qtType?: string) {
    return this.quotationService.findAll(status, qtType);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quotationService.findOne(id);
  }

  @Get(':id/items-for-po')
  getItemsForPO(@Param('id', ParseIntPipe) id: number) {
    return this.quotationService.getItemsForPO(id);
  }

  @Get(':id/items-for-invoice')
  getItemsForInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.quotationService.getItemsForInvoice(id);
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.quotationService.create(dto, req.user.sub);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Request() req: any) {
    return this.quotationService.update(id, dto, req.user.sub);
  }

  @Post(':id/submit')
  submitForApproval(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.quotationService.submitForApproval(id, req.user.sub);
  }

  @Post(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number, @Body('note') note: string, @Request() req: any) {
    return this.quotationService.approve(id, req.user.sub, note);
  }

  @Post(':id/approve-margin')
  approveMargin(@Param('id', ParseIntPipe) id: number, @Body('note') note: string, @Request() req: any) {
    return this.quotationService.approveMargin(id, req.user.sub, note);
  }

  @Post(':id/send')
  send(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.quotationService.send(id, req.user.sub);
  }

  @Post(':id/confirm')
  confirm(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.quotationService.confirm(id, req.user.sub);
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string, @Request() req: any) {
    return this.quotationService.cancel(id, req.user.sub, reason);
  }

  @Post(':id/items/:itemId/cancel')
  cancelItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    return this.quotationService.cancelItem(id, itemId, req.user.sub, reason);
  }
}
