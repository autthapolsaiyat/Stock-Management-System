import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { getAuditContext } from '../../common/utils';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiQuery({ name: 'groupId', required: false, type: Number })
  findAll(@Query('groupId') groupId?: string) { 
    return this.customerService.findAll(groupId ? parseInt(groupId) : undefined); 
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.customerService.findOne(id); }

  @Post()
  create(@Body() dto: any, @Req() req: any) { return this.customerService.create(dto, getAuditContext(req)); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: any) { return this.customerService.update(id, dto, getAuditContext(req)); }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) { return this.customerService.delete(id, getAuditContext(req)); }

  @Put(':id/group')
  updateGroup(
    @Param('id', ParseIntPipe) id: number, 
    @Body('groupId', ParseIntPipe) groupId: number
  ) { 
    return this.customerService.updateGroup(id, groupId); 
  }
}
