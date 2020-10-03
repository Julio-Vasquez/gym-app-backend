import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

import { Suscription } from '../users/suscription.entity';

@Entity('update_suscription')
@Index(['username'], { unique: false })
export class UpdateSuscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  username: string;

  @Column('simple-json', { nullable: false })
  oldData: Suscription;

  @Column('simple-json', { nullable: false })
  newData: Suscription;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
