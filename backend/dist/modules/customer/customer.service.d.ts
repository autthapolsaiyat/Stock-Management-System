import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
export declare class CustomerService {
    private customerRepository;
    constructor(customerRepository: Repository<CustomerEntity>);
    findAll(): Promise<CustomerEntity[]>;
    findOne(id: number): Promise<CustomerEntity>;
    create(dto: any): Promise<CustomerEntity[]>;
    update(id: number, dto: any): Promise<CustomerEntity>;
    delete(id: number): Promise<CustomerEntity>;
}
