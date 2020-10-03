import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

import { People } from '../users/people.entity';

@Entity('update_user')
@Index(['username'], { unique: false })
export class UpdateUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  username: string;

  @Column('simple-json', { nullable: false })
  oldData: People;

  @Column('simple-json', { nullable: false })
  newData: People;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
