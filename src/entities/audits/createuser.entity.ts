import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

import { People } from '../users/people.entity';

@Entity('create_user', { schema: 'audits' })
@Index(['username'], { unique: true })
export class CreateUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    length: 50,
    nullable: false,
  })
  username: string;

  @Column('simple-json', { nullable: false })
  data: People;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}