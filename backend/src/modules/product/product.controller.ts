import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, CreateUnitDto } from './dto/product.dto';

interface AuditContext {
  userId: number;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
}

function getAuditContext(req: any): AuditContext {
  return {
    userId: req.user?.sub || req.user?.id,
    userName: req.user?.fullName || req.user?.username,
    ipAddress: req.ip || req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
  };
}

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
  createCategory(@Body() dto: CreateCategoryDto, @Req() req: any) {
    return this.productService.createCategory(dto, getAuditContext(req));
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update category' })
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: any) {
    return this.productService.updateCategory(id, dto, getAuditContext(req));
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  deleteCategory(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.productService.deleteCategory(id, getAuditContext(req));
  }

  @Get('units')
  @ApiOperation({ summary: 'Get all units' })
  findAllUnits() {
    return this.productService.findAllUnits();
  }

  @Post('units')
  @ApiOperation({ summary: 'Create unit' })
  createUnit(@Body() dto: CreateUnitDto, @Req() req: any) {
    return this.productService.createUnit(dto, getAuditContext(req));
  }

  @Put('units/:id')
  @ApiOperation({ summary: 'Update unit' })
  updateUnit(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: any) {
    return this.productService.updateUnit(id, dto, getAuditContext(req));
  }

  @Delete('units/:id')
  @ApiOperation({ summary: 'Delete unit' })
  deleteUnit(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.productService.deleteUnit(id, getAuditContext(req));
  }

  @Get('price-history')
  @ApiOperation({ summary: 'Get price history for all products from approved quotations' })
  getPriceHistory() {
    return this.productService.getPriceHistory();
  }

  @Get(':id/price-history')
  @ApiOperation({ summary: 'Get price history for a specific product' })
  getProductPriceHistory(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductPriceHistory(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productService.create(dto, getAuditContext(req));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto, @Req() req: any) {
    return this.productService.update(id, dto, getAuditContext(req));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.productService.delete(id, getAuditContext(req));
  }
}
