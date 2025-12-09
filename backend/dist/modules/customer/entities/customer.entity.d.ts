import { CustomerContactEntity } from './customer-contact.entity';
export declare class CustomerEntity {
    id: number;
    code: string;
    name: string;
    taxId: string;
    address: string;
    phone: string;
    email: string;
    creditLimit: number;
    creditTermDays: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    contacts: CustomerContactEntity[];
}
