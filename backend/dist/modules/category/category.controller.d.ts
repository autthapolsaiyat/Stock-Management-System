import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(): Promise<import("../product/entities").ProductCategoryEntity[]>;
    findOne(id: number): Promise<import("../product/entities").ProductCategoryEntity>;
    create(dto: any): Promise<import("../product/entities").ProductCategoryEntity[]>;
    update(id: number, dto: any): Promise<import("../product/entities").ProductCategoryEntity>;
    delete(id: number): Promise<import("../product/entities").ProductCategoryEntity>;
}
