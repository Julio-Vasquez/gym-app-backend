import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { People } from '../../entities/users/people.entity';
import { CreateService } from './services/create.service';
import { FindService } from './services/find.service';
import { UpdateService } from './services/update.service';

@Module({
  imports: [TypeOrmModule.forFeature([People])],
  controllers: [UsersController],
  providers: [CreateService, FindService, UpdateService],
})
export class UsersModule {}
