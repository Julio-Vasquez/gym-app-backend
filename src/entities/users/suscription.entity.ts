import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { States, Concept } from '../enums';
import { People } from './people.entity';

@Entity('suscription')
export class Suscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bigint', { nullable: false })
  cost: number;

  @Column('int', { nullable: true })
  debt: number;

  @Column('int', { nullable: false })
  days: number;

  @Column('date', { nullable: false })
  start: string;

  @Column('date', { nullable: false })
  end: string;

  @Column('enum', {
    enum: Concept,
    nullable: false,
    default: Concept.Men,
  })
  concept: string;

  @Column('enum', { enum: States, default: States.Active })
  state: States;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    type => People,
    people => people.suscription,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'fk_people' })
  people: People;
}
