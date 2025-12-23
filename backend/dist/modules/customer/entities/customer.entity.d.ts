import { CustomerGroupEntity } from '../../customer-group/entities/customer-group.entity';
export declare class CustomerEntity {
    id: number;
    code: string;
    name: string;
    taxId: string;
    address: string;
    phone: string;
    email: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    creditLimit: number;
    creditTermDays: number;
    groupId: number;
    group: CustomerGroupEntity;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
