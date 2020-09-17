import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('create_user', { schema: 'audits' })
@Index(['username'], { unique: true })
export class People {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    length: 50,
    nullable: false,
  })
  username: string;

  @Column('simple-json', { nullable: false })
  data: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
