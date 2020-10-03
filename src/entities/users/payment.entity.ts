import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';

import { People } from '../users/people.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bigint', { nullable: false })
  cost: number;

  @Column('int', { nullable: false })
  days: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  username: string;

  @ManyToOne(
    type => People,
    people => people.payment,
    { nullable: false }
  )
  @JoinColumn({ name: 'fk_people' })

  people: People;
}
