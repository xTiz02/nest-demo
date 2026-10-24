import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === 'string' ? parseFloat(value) : value),
    },
  })
  price: number;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'boolean', default: true })
  inStock: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
