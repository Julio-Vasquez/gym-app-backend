import { Controller, HttpStatus, Post, Body } from '@nestjs/common';

import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly loginService: LoginService,
    private readonly forgotPasswordService: ForgotPasswordService
  ) { }

  @Post('login')
  public async Login(@Body() account: LoginDto) {
    const res = await this.loginService.Login(account);
    if (res.error) return { ...res, status: HttpStatus.UNAUTHORIZED };

    return { payload: res, success: 'ok' };
  }
}