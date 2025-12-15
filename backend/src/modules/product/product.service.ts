import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { UnitEntity } from './entities/unit.entity';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, CreateUnitDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductCategoryEntity) private categoryRepository: Repository<ProductCategoryEntity>,
    @InjectRepository(UnitEntity) private unitRepository: Repository<UnitEntity>,
  ) {}

  async findAll(categoryId?: number, quotationType?: string) {
    const where: any = { isActive: true };
    if (categoryId) where.categoryId = categoryId;
    if (quotationType) where.quotationType = quotationType;
    return this.productRepository.find({ where, relations: ['category', 'unit'], order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['category', 'unit'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    const existing = await this.productRepository.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Product code already exists');

    const product = this.productRepository.create({ ...dto, isActive: true });
    const savedProduct = await this.productRepository.save(product);
    return this.findOne(savedProduct.id);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    await this.productRepository.save(product);
    return this.findOne(id);
  }

  async delete(id: number) {
    const product = await this.findOne(id);
    product.isActive = false;
    return this.productRepository.save(product);
  }

  // Categories
  async findAllCategories() {
    return this.categoryRepository.find({ where: { isActive: true } });
  }

  async createCategory(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create({ ...dto, isActive: true });
    return this.categoryRepository.save(category);
  }

  // Units
  async findAllUnits() {
    return this.unitRepository.find({ where: { isActive: true } });
  }

  async createUnit(dto: CreateUnitDto) {
    const existing = await this.unitRepository.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Unit name already exists');
    const unit = this.unitRepository.create({ ...dto, isActive: true });
    return this.unitRepository.save(unit);
  }
}
