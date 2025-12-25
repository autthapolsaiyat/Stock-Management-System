import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupplierService } from './supplier.service';
import { getAuditContext } from '../../common/utils';

@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  findAll() { return this.supplierService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.supplierService.findOne(id); }

  @Post()
  create(@Body() dto: any, @Req() req: any) { return this.supplierService.create(dto, getAuditContext(req)); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: any) { return this.supplierService.update(id, dto, getAuditContext(req)); }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) { return this.supplierService.delete(id, getAuditContext(req)); }
}
