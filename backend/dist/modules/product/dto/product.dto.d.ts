export declare class CreateProductDto {
    code: string;
    name: string;
    description?: string;
    categoryId?: number;
    unitId?: number;
    barcode?: string;
    imageUrl?: string;
    sellingPrice?: number;
    standardCost?: number;
    minStock?: number;
    maxStock?: number;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    categoryId?: number;
    unitId?: number;
    barcode?: string;
    imageUrl?: string;
    sellingPrice?: number;
    standardCost?: number;
    minStock?: number;
    maxStock?: number;
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
