import { Response } from 'express';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
export declare class VCardController {
    private userRepository;
    private dataSource;
    constructor(userRepository: Repository<UserEntity>, dataSource: DataSource);
    getVCard(username: string, res: Response): Promise<void>;
    private buildVCard;
}
