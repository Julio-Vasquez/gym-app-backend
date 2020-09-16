import { Controller, HttpStatus, Post, Body } from '@nestjs/common';

import { LoginService } from './services/login.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
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
}
