import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupplierService } from './supplier.service';

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
  create(@Body() dto: any) { return this.supplierService.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.supplierService.update(id, dto); }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) { return this.supplierService.delete(id); }
}
