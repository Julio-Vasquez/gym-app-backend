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

@Entity('user', { schema: 'users' })
@Index(['key', 'username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    length: 50,
    nullable: false,
  })
  username: string;

  @Column('character varying', {
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
  @JoinColumn({ name: 'fk_userId' })
  people: People;
}
