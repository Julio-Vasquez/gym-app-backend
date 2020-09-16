import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './../../entities/users/user.entity';
import { AuthController } from './auth.controller';
import { LoginService } from './services/login.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      privateKey: 'asdadasdsa',
      signOptions: {
        expiresIn: 21600,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginService, ForgotPasswordService],
})
export class AuthModule {}
