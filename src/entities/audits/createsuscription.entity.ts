import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

import { Suscription } from '../users/suscription.entity';

@Entity('create_suscription', { schema: 'audits' })
@Index(['username'], { unique: true })
export class CreateSuscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    length: 50,
    nullable: false,
  })
  username: string;

  @Column('simple-json', { nullable: false })
  data: Suscription;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
