import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { UnitEntity } from './entities/unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductCategoryEntity, UnitEntity])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
