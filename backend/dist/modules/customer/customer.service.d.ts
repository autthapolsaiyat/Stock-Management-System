import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
export declare class CustomerService {
    private customerRepository;
    constructor(customerRepository: Repository<CustomerEntity>);
    findAll(groupId?: number): Promise<CustomerEntity[]>;
    findOne(id: number): Promise<CustomerEntity>;
    create(dto: any): Promise<CustomerEntity[]>;
    update(id: number, dto: any): Promise<CustomerEntity>;
    updateGroup(id: number, groupId: number): Promise<CustomerEntity>;
    findByGroup(groupId: number): Promise<CustomerEntity[]>;
}
