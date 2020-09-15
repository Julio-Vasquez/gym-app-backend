import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn } from 'typeorm';

import { States } from './enums/states.enum';
import { People } from './people.entity';

@Entity('user')
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

  @OneToOne(
    type => People,
    people => people.user, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'fk_userId' })
  people: People
}
