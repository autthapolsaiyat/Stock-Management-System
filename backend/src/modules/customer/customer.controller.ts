import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerService } from './customer.service';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll() { return this.customerService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.customerService.findOne(id); }

  @Post()
  create(@Body() dto: any) { return this.customerService.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.customerService.update(id, dto); }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) { return this.customerService.delete(id); }
}
