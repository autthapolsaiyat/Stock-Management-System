import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerGroupService } from './customer-group.service';
import { CustomerGroupEntity } from './entities/customer-group.entity';

@ApiTags('Customer Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-groups')
export class CustomerGroupController {
  constructor(private readonly customerGroupService: CustomerGroupService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customer groups' })
  findAll(): Promise<CustomerGroupEntity[]> {
    return this.customerGroupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer group by ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerGroupEntity> {
    return this.customerGroupService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create customer group' })
  create(@Body() data: Partial<CustomerGroupEntity>): Promise<CustomerGroupEntity> {
    return this.customerGroupService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer group' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CustomerGroupEntity>,
  ): Promise<CustomerGroupEntity> {
    return this.customerGroupService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer group' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.customerGroupService.remove(id);
  }
}
