import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { People } from './people.entity';
import { States } from './../enums';

@Entity('user')
@Index(['key', 'username', 'mail'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  username: string;

  @Column('varchar', {
    length: 250,
    nullable: false,
  })
  password: string;

  @Column('uuid', { nullable: false })
  key: string;

  @Column('enum', {
    enum: States,
    default: States.Active,
    nullable: false,
  })
  state: States;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  mail: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(
    type => People,
    people => people.user,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'fk_peopleId' })
  people: People;
}
