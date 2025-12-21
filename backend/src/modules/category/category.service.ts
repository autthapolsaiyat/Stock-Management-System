import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryEntity } from '../product/entities/product-category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private categoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  async findAll() {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: any) {
    const category = this.categoryRepository.create({
      ...dto,
      isActive: true,
    });
    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: any) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async delete(id: number) {
    const category = await this.findOne(id);
    category.isActive = false;
    return this.categoryRepository.save(category);
  }
}
