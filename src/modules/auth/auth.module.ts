import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './../../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { };