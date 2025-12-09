export declare class CreateProductDto {
    code: string;
    name: string;
    description?: string;
    categoryId?: number;
    unitId?: number;
    barcode?: string;
    sellingPrice?: number;
    standardCost?: number;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    categoryId?: number;
    unitId?: number;
    sellingPrice?: number;
    standardCost?: number;
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    parentId?: number;
}
export declare class CreateUnitDto {
    name: string;
    abbreviation?: string;
}
