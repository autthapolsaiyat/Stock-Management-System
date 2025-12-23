import { Repository } from 'typeorm';
import { CustomerGroupEntity } from './entities/customer-group.entity';
export declare class CustomerGroupService {
    private readonly customerGroupRepository;
    constructor(customerGroupRepository: Repository<CustomerGroupEntity>);
    findAll(): Promise<CustomerGroupEntity[]>;
    findOne(id: number): Promise<CustomerGroupEntity>;
    findByCode(code: string): Promise<CustomerGroupEntity>;
    create(data: Partial<CustomerGroupEntity>): Promise<CustomerGroupEntity>;
    update(id: number, data: Partial<CustomerGroupEntity>): Promise<CustomerGroupEntity>;
    remove(id: number): Promise<void>;
}
