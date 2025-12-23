import { CustomerService } from './customer.service';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    findAll(groupId?: string): Promise<import("./entities").CustomerEntity[]>;
    findOne(id: number): Promise<import("./entities").CustomerEntity>;
    create(dto: any): Promise<import("./entities").CustomerEntity[]>;
    update(id: number, dto: any): Promise<import("./entities").CustomerEntity>;
    updateGroup(id: number, groupId: number): Promise<import("./entities").CustomerEntity>;
}
