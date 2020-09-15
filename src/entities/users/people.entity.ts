import { Entity, Column, PrimaryGeneratedColumn, OneToOne, Index } from 'typeorm'

import { User } from './user.entity';
import { Genders } from './../enums';

@Entity('people')
@Index(['phone'], { unique: true })
export class People {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 75, nullable: false })
  name: string;

  @Column('varchar', { length: 75, nullable: false })
  lastName: string;

  @Column('timestamp')
  dateBirth: string;

  @Column('bigint', { nullable: false })
  phone: number;

  @Column('enum', {
    enum: Genders,
    nullable: false
  })
  gender: string;

  @OneToOne(
    type => User,
    user => user.people, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  user: User;
}