import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { QuotationEntity } from './quotation.entity';

@Entity('quotation_items')
export class QuotationItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quotation_id' })
  quotationId: number;

  @Column({ name: 'line_no' })
  lineNo: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  qty: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 })
  unitPrice: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 15, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 })
  lineTotal: number;

  @ManyToOne(() => QuotationEntity, quotation => quotation.items)
  @JoinColumn({ name: 'quotation_id' })
  quotation: QuotationEntity;
}
