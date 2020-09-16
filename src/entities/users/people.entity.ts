import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Genders, Roles } from './../enums';

@Entity('people', { schema: 'users' })
@Index(['phone', 'identification'], { unique: true })
export class People {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 75, nullable: false })
  name: string;

  @Column('varchar', { length: 75, nullable: false })
  lastName: string;

  @Column('bigint', { nullable: false })
  identification: number;

  @Column('date')
  dateBirth: string;

  @Column('bigint', { nullable: false })
  phone: number;

  @Column('enum', {
    enum: Genders,
    nullable: false,
  })
  gender: string;

  @Column('enum', {
    enum: Roles,
    nullable: false,
  })
  role: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(
    type => User,
    user => user.people,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  user: User;
}
