import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { People } from 'src/entities/users/people.entity';
import { User } from 'src/entities/users/user.entity';

import { PeopleDefault } from './database/people.default';
import { UserDefault } from './database/user.default';

import { Mail } from './email';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([People, User])],
  controllers: [],
  providers: [PeopleDefault, UserDefault, Mail],
  exports: [Mail],
})
export class CommonModule {}
