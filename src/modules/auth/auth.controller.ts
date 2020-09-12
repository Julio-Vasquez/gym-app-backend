import { Controller, HttpStatus, Post, Body } from '@nestjs/common';

import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { SignupDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly loginService: LoginService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @Post('login')
  public async Login(@Body() account: LoginDto) {
    const res = await this.loginService.Login(account);
    return res.error
      ? { ...res, status: HttpStatus.UNAUTHORIZED }
      : { token: res, success: 'ok' };
  }

  @Post('signup')
  public async Singup(@Body() account: SignupDto) {
    const res = await this.signupService.CreateAccount(account);
    return res.error
      ? { ...res, status: HttpStatus.CONFLICT }
      : { ...res, success: 'ok' };
  }
}
