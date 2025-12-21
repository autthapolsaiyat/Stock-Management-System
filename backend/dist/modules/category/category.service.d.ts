import { Repository } from 'typeorm';
import { ProductCategoryEntity } from '../product/entities/product-category.entity';
export declare class CategoryService {
    private categoryRepository;
    constructor(categoryRepository: Repository<ProductCategoryEntity>);
    findAll(): Promise<ProductCategoryEntity[]>;
    findOne(id: number): Promise<ProductCategoryEntity>;
    create(dto: any): Promise<ProductCategoryEntity[]>;
    update(id: number, dto: any): Promise<ProductCategoryEntity>;
    delete(id: number): Promise<ProductCategoryEntity>;
}
