import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

import { People } from '../users/people.entity';

@Entity('create_user')
@Index(['username'], { unique: false })
export class CreateUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  username: string;

  @Column('simple-json', { nullable: false })
  data: People;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
