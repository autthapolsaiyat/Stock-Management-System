import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, CreateUnitDto } from './dto/product.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    findAll(categoryId?: string): Promise<import("./entities").ProductEntity[]>;
    findAllCategories(): Promise<import("./entities").ProductCategoryEntity[]>;
    createCategory(dto: CreateCategoryDto): Promise<import("./entities").ProductCategoryEntity>;
    findAllUnits(): Promise<import("./entities").UnitEntity[]>;
    createUnit(dto: CreateUnitDto): Promise<import("./entities").UnitEntity>;
    findOne(id: number): Promise<import("./entities").ProductEntity>;
    create(dto: CreateProductDto): Promise<import("./entities").ProductEntity>;
    update(id: number, dto: UpdateProductDto): Promise<import("./entities").ProductEntity>;
    delete(id: number): Promise<import("./entities").ProductEntity>;
}
