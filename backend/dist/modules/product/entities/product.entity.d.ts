import { ProductCategoryEntity } from './product-category.entity';
import { UnitEntity } from './unit.entity';
export declare class ProductEntity {
    id: number;
    code: string;
    name: string;
    description: string;
    categoryId: number;
    unitId: number;
    barcode: string;
    minStock: number;
    maxStock: number;
    reorderPoint: number;
    standardCost: number;
    sellingPrice: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: ProductCategoryEntity;
    unit: UnitEntity;
}
