import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('units')
export class UnitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 10, nullable: true })
  abbreviation: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
