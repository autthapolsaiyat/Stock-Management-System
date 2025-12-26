import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('fixed_assets')
export class FixedAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'asset_code', length: 50, unique: true })
  assetCode: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  category: string; // BUILDING, VEHICLE, MACHINERY, FURNITURE, COMPUTER, OTHER

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ name: 'acquisition_date', type: 'date' })
  acquisitionDate: Date;

  @Column({ name: 'acquisition_cost', type: 'decimal', precision: 15, scale: 2 })
  acquisitionCost: number;

  @Column({ name: 'useful_life' })
  usefulLife: number; // years

  @Column({ name: 'salvage_value', type: 'decimal', precision: 15, scale: 2, default: 1 })
  salvageValue: number;

  @Column({ name: 'depreciation_method', length: 30, default: 'STRAIGHT_LINE' })
  depreciationMethod: string; // STRAIGHT_LINE, DECLINING_BALANCE

  @Column({ name: 'accumulated_depreciation', type: 'decimal', precision: 15, scale: 2, default: 0 })
  accumulatedDepreciation: number;

  @Column({ name: 'net_book_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
  netBookValue: number;

  @Column({ length: 20, default: 'ACTIVE' })
  status: string; // ACTIVE, DISPOSED, FULLY_DEPRECIATED

  @Column({ name: 'disposal_date', type: 'date', nullable: true })
  disposalDate: Date;

  @Column({ name: 'disposal_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  disposalAmount: number;

  @OneToMany(() => DepreciationHistory, (history) => history.fixedAsset, { cascade: true })
  depreciationHistory: DepreciationHistory[];

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('depreciation_history')
export class DepreciationHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fixed_asset_id' })
  fixedAssetId: number;

  @ManyToOne(() => FixedAsset, (asset) => asset.depreciationHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fixed_asset_id' })
  fixedAsset: FixedAsset;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column({ name: 'depreciation_amount', type: 'decimal', precision: 15, scale: 2 })
  depreciationAmount: number;

  @Column({ name: 'accumulated_depreciation', type: 'decimal', precision: 15, scale: 2 })
  accumulatedDepreciation: number;

  @Column({ name: 'net_book_value', type: 'decimal', precision: 15, scale: 2 })
  netBookValue: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

// Need to import ManyToOne and JoinColumn for DepreciationHistory
import { ManyToOne, JoinColumn } from 'typeorm';
