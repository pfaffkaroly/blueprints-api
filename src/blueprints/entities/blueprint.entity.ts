import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('blueprints')
export class Blueprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column()
  author: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'simple-json' : 'jsonb',
  })
  data: Record<string, any>;
}