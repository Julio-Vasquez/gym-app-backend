import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from '../../entities/users/people.entity';
import { PersonService } from './services/person.service';

@Module({
  imports: [TypeOrmModule.forFeature([People])],
  controllers: [UsersController],
  providers: [PersonService],
})
export class UsersModule {}
