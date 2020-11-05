import { Controller, HttpStatus, Post, Body, Put } from '@nestjs/common';

import { LoginService } from './services/login.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ForgotPasswordDto, LoginDto, UpdatePasswordDto } from './dto';

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

  @Post('request-forgot-password')
  public async RequesForgotPassword(@Body() account: ForgotPasswordDto) {
    const res = await this.forgotPasswordService.RequestForgotPassword(account);
    return res?.error
      ? { ...res, status: HttpStatus.CONFLICT }
      : { ...res, detail: 'MAIL_SEND' };
  }

  @Put('forgot-password')
  public async ForgotPassword(@Body() forgot: UpdatePasswordDto) {
    const res = await this.forgotPasswordService.ForgotPassword(forgot);
    return res?.error
      ? { ...res, status: HttpStatus.CONFLICT }
      : { ...res, detail: 'PASSWORD_UPDATE!' };
  }
}
