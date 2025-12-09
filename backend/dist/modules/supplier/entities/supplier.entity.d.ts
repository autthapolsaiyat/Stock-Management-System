import { SupplierContactEntity } from './supplier-contact.entity';
export declare class SupplierEntity {
    id: number;
    code: string;
    name: string;
    taxId: string;
    address: string;
    phone: string;
    email: string;
    paymentTermDays: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    contacts: SupplierContactEntity[];
}
