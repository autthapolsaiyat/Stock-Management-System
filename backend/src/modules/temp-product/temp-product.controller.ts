import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TempProductService } from './temp-product.service';

@ApiTags('Temp Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('temp-products')
export class TempProductController {
  constructor(private readonly tempProductService: TempProductService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    return this.tempProductService.findAll(status);
  }

  @Get('quotation/:quotationId')
  findByQuotation(@Param('quotationId', ParseIntPipe) quotationId: number) {
    return this.tempProductService.findByQuotation(quotationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tempProductService.findOne(id);
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.tempProductService.create(dto, req.user.sub);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Request() req: any) {
    return this.tempProductService.update(id, dto, req.user.sub);
  }

  @Post(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Request() req: any) {
    return this.tempProductService.activate(id, dto, req.user.sub);
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.tempProductService.cancel(id, req.user.sub);
  }
}
