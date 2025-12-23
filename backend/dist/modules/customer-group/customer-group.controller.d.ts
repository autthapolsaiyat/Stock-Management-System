import { CustomerGroupService } from './customer-group.service';
import { CustomerGroupEntity } from './entities/customer-group.entity';
export declare class CustomerGroupController {
    private readonly customerGroupService;
    constructor(customerGroupService: CustomerGroupService);
    findAll(): Promise<CustomerGroupEntity[]>;
    findOne(id: number): Promise<CustomerGroupEntity>;
    create(data: Partial<CustomerGroupEntity>): Promise<CustomerGroupEntity>;
    update(id: number, data: Partial<CustomerGroupEntity>): Promise<CustomerGroupEntity>;
    remove(id: number): Promise<void>;
}
