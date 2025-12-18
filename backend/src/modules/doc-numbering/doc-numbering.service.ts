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

  // Quotation type code mapping
  private getQuotationTypeCode(quotationType: string): string {
    const typeCodeMap: Record<string, string> = {
      'STANDARD': 'ACC',
      'FORENSIC': 'FSC',
      'LAB': 'LAB',
      'MAINTENANCE': 'SVC',
    };
    return typeCodeMap[quotationType] || 'ACC';
  }

  async generateDocNumber(docType: string, queryRunner?: QueryRunner, quotationType?: string): Promise<{ docNo: string; docBaseNo: string; docFullNo: string }> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // For Thai Buddhist year (พ.ศ.)
    const thaiYear = (now.getFullYear() + 543).toString().slice(-2);
    
    const repo = queryRunner ? queryRunner.manager.getRepository(DocSequenceEntity) : this.seqRepository;
    
    // For quotations, use quotationType in the sequence key
    let seqKey = docType;
    if (docType === 'QT' && quotationType) {
      seqKey = `QT-${quotationType}`;
    }
    
    const yearMonth = `${year}${month}`;
    
    let seq = await repo.findOne({ where: { docType: seqKey, yearMonth } });
    
    if (!seq) {
      seq = repo.create({ docType: seqKey, yearMonth, lastNumber: 0, prefix: docType });
      await repo.save(seq);
    }
    
    seq.lastNumber += 1;
    await repo.save(seq);
    
    let docBaseNo: string;
    let docFullNo: string;
    
    // Generate document number based on type
    if (docType === 'QT' && quotationType) {
      // Format: SVS-[TYPE_CODE]-[SEQ]-[MONTH]-[THAI_YEAR]
      // Example: SVS-ACC-001-12-68
      const typeCode = this.getQuotationTypeCode(quotationType);
      const seqNo = String(seq.lastNumber).padStart(3, '0');
      docBaseNo = `SVS-${typeCode}-${seqNo}-${month}-${thaiYear}`;
      docFullNo = docBaseNo;
    } else {
      // Default format for other document types
      docBaseNo = `${docType}${yearMonth}${String(seq.lastNumber).padStart(4, '0')}`;
      docFullNo = docBaseNo;
    }
    
    return { docNo: docBaseNo, docBaseNo, docFullNo };
  }
}
