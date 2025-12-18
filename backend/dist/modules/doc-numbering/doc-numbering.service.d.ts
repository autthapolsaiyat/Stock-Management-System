import { Repository, QueryRunner } from 'typeorm';
import { DocSequenceEntity } from './entities/doc-sequence.entity';
export declare class DocNumberingService {
    private seqRepository;
    constructor(seqRepository: Repository<DocSequenceEntity>);
    private getQuotationTypeCode;
    generateDocNumber(docType: string, queryRunner?: QueryRunner, quotationType?: string): Promise<{
        docNo: string;
        docBaseNo: string;
        docFullNo: string;
    }>;
}
