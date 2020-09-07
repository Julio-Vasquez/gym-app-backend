import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './../../entities/user.entity';
import { AuthController } from './auth.controller';
import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { ForgotPasswordService } from './services/forgot-password.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    SignupService,
    LoginService,
    ForgotPasswordService
  ]
})
export class AuthModule { };