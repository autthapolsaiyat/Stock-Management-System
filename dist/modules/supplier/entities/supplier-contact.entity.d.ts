import { SupplierEntity } from './supplier.entity';
export declare class SupplierContactEntity {
    id: number;
    supplierId: number;
    name: string;
    position: string;
    phone: string;
    email: string;
    isPrimary: boolean;
    supplier: SupplierEntity;
}
