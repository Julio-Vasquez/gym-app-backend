import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { CreateService } from './services/create.service';
import { FindService } from './services/find.service';
import { UpdateService } from './services/update.service';

import { People } from '../../entities/users/people.entity';
import { CreateUser } from 'src/entities/audits/createuser.entity';
import { UpdateUser } from 'src/entities/audits/updateuser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([People, CreateUser, UpdateUser]),
    JwtModule.register({
      privateKey: 'asdadasdsa',
    }),
  ],
  controllers: [UsersController],
  providers: [CreateService, FindService, UpdateService],
})
export class UsersModule {}
