import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, CreateUnitDto } from './dto/product.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    findAll(categoryId?: string, quotationType?: string): Promise<import("./entities").ProductEntity[]>;
    findAllCategories(): Promise<import("./entities").ProductCategoryEntity[]>;
    createCategory(dto: CreateCategoryDto): Promise<import("./entities").ProductCategoryEntity>;
    findAllUnits(): Promise<import("./entities").UnitEntity[]>;
    createUnit(dto: CreateUnitDto): Promise<import("./entities").UnitEntity>;
    getPriceHistory(): Promise<Record<number, any>>;
    getProductPriceHistory(id: number): Promise<{
        salesCount: any;
        minPrice: number;
        maxPrice: number;
        avgPrice: number;
        lastPrice: number;
        history: any;
    }>;
    findOne(id: number): Promise<import("./entities").ProductEntity>;
    create(dto: CreateProductDto): Promise<import("./entities").ProductEntity>;
    update(id: number, dto: UpdateProductDto): Promise<import("./entities").ProductEntity>;
    delete(id: number): Promise<import("./entities").ProductEntity>;
}
