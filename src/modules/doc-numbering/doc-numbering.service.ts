import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { DocSequenceEntity } from './entities/doc-sequence.entity';

@Injectable()
export class DocNumberingService {
  constructor(
    @InjectRepository(DocSequenceEntity)
    private seqRepository: Repository<DocSequenceEntity>,
  ) {}

  async generateDocNumber(docType: string, queryRunner?: QueryRunner): Promise<{ docNo: string; docBaseNo: string; docFullNo: string }> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}${month}`;
    
    const repo = queryRunner ? queryRunner.manager.getRepository(DocSequenceEntity) : this.seqRepository;
    
    let seq = await repo.findOne({ where: { docType, yearMonth } });
    
    if (!seq) {
      seq = repo.create({ docType, yearMonth, lastNumber: 0, prefix: docType });
      await repo.save(seq);
    }
    
    seq.lastNumber += 1;
    await repo.save(seq);
    
    const docBaseNo = `${docType}${yearMonth}${String(seq.lastNumber).padStart(4, '0')}`;
    const docFullNo = docBaseNo; // Initially same as base, will add revision if needed
    
    return { docNo: docBaseNo, docBaseNo, docFullNo };
  }
}
