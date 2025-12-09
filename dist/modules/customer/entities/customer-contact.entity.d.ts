import { CustomerEntity } from './customer.entity';
export declare class CustomerContactEntity {
    id: number;
    customerId: number;
    name: string;
    position: string;
    phone: string;
    email: string;
    isPrimary: boolean;
    customer: CustomerEntity;
}
