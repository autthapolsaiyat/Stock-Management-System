import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { StockIssueEntity } from './stock-issue.entity';

@Entity('stock_issue_items')
export class StockIssueItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stock_issue_id' })
  stockIssueId: number;

  @Column({ name: 'line_no' })
  lineNo: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  qty: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
  unitCost: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4, default: 0 })
  lineTotal: number;

  @ManyToOne(() => StockIssueEntity, issue => issue.items)
  @JoinColumn({ name: 'stock_issue_id' })
  stockIssue: StockIssueEntity;
}
