export declare class ProductCategoryEntity {
    id: number;
    name: string;
    description: string;
    parentId: number;
    isActive: boolean;
    parent: ProductCategoryEntity;
}
