import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('withholding_taxes')
export class WithholdingTaxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'doc_no', length: 50, unique: true })
  docNo: string;

  @Column({ name: 'doc_date', type: 'date' })
  docDate: Date;

  @Column({ name: 'payment_date', type: 'date' })
  paymentDate: Date;

  // Payer (Company)
  @Column({ name: 'payer_name', length: 255 })
  payerName: string;

  @Column({ name: 'payer_tax_id', length: 20 })
  payerTaxId: string;

  @Column({ name: 'payer_address', type: 'text', nullable: true })
  payerAddress: string;

  // Payee (Supplier/Vendor)
  @Column({ name: 'payee_id', nullable: true })
  payeeId: number;

  @Column({ name: 'payee_name', length: 255 })
  payeeName: string;

  @Column({ name: 'payee_tax_id', length: 20 })
  payeeTaxId: string;

  @Column({ name: 'payee_address', type: 'text', nullable: true })
  payeeAddress: string;

  @Column({ name: 'form_type', length: 10 })
  formType: string; // PND1, PND3, PND53

  @Column({ name: 'income_type', length: 10 })
  incomeType: string; // 1, 2, 3, 4a, 4b, 5, 6, 7, 8

  @Column({ name: 'income_description', length: 255, nullable: true })
  incomeDescription: string;

  @Column({ name: 'income_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  incomeAmount: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'payment_type', length: 20 })
  paymentType: string; // CASH, CHEQUE, TRANSFER

  @Column({ length: 20, default: 'DRAFT' })
  status: string; // DRAFT, ISSUED, SUBMITTED, CANCELLED

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
