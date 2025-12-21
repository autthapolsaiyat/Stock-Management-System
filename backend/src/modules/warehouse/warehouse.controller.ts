import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WarehouseService } from './warehouse.service';

@ApiTags('Warehouses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.findOne(id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.warehouseService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.warehouseService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.delete(id);
  }
}
