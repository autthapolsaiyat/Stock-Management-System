import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, CreateUnitDto } from './dto/product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'quotationType', required: false, description: 'STANDARD, FORENSIC, MAINTENANCE' })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('quotationType') quotationType?: string,
  ) {
    return this.productService.findAll(
      categoryId ? parseInt(categoryId) : undefined,
      quotationType || undefined,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  findAllCategories() {
    return this.productService.findAllCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create category' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.productService.createCategory(dto);
  }

  @Get('units')
  @ApiOperation({ summary: 'Get all units' })
  findAllUnits() {
    return this.productService.findAllUnits();
  }

  @Post('units')
  @ApiOperation({ summary: 'Create unit' })
  createUnit(@Body() dto: CreateUnitDto) {
    return this.productService.createUnit(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}
