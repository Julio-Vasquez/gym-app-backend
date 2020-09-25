import { type } from 'os';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { People } from './people.entity';

@Entity('suscription', { schema: 'users' })
export class Suscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bigint', { nullable: false })
  cost: number;

  @Column('int', { nullable: false })
  days: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    type => People,
    people => people.suscription,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'fk_people' })
  @Column({ type: Number })
  people: People;

}
