import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity('serial_numbers')
@Index(['productId', 'serialNo'], { unique: true })
export class SerialNumberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'serial_no', length: 100 })
  serialNo: string;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: number;

  @Column({ name: 'status', length: 20, default: 'IN_STOCK' })
  status: string; // IN_STOCK, SOLD, RESERVED, DEFECTIVE, RETURNED

  // GR Reference (where it came in)
  @Column({ name: 'gr_id', nullable: true })
  grId: number;

  @Column({ name: 'gr_doc_no', length: 50, nullable: true })
  grDocNo: string;

  @Column({ name: 'received_date', type: 'date', nullable: true })
  receivedDate: Date;

  // Sales Reference (where it went out)
  @Column({ name: 'invoice_id', nullable: true })
  invoiceId: number;

  @Column({ name: 'invoice_doc_no', length: 50, nullable: true })
  invoiceDocNo: string;

  @Column({ name: 'sold_date', type: 'date', nullable: true })
  soldDate: Date;

  // Additional info
  @Column({ name: 'lot_no', length: 50, nullable: true })
  lotNo: string;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
