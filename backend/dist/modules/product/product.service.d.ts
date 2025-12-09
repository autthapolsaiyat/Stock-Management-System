import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { UnitEntity } from './entities/unit.entity';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, CreateUnitDto } from './dto/product.dto';
export declare class ProductService {
    private productRepository;
    private categoryRepository;
    private unitRepository;
    constructor(productRepository: Repository<ProductEntity>, categoryRepository: Repository<ProductCategoryEntity>, unitRepository: Repository<UnitEntity>);
    findAll(categoryId?: number): Promise<ProductEntity[]>;
    findOne(id: number): Promise<ProductEntity>;
    create(dto: CreateProductDto): Promise<ProductEntity>;
    update(id: number, dto: UpdateProductDto): Promise<ProductEntity>;
    delete(id: number): Promise<ProductEntity>;
    findAllCategories(): Promise<ProductCategoryEntity[]>;
    createCategory(dto: CreateCategoryDto): Promise<ProductCategoryEntity>;
    findAllUnits(): Promise<UnitEntity[]>;
    createUnit(dto: CreateUnitDto): Promise<UnitEntity>;
}
