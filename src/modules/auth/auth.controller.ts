import { Controller, Get } from '@nestjs/common';

import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { ForgotPasswordService } from './services/forgot-password.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly loginService: LoginService,
    private readonly forgotPasswordService: ForgotPasswordService
  ) { }

  @Get('login')
  public async Login() {
    const res = await this.loginService.Login();
    return "";
    // if (res.length > 0) return { ...res };
    // return { error: 'No registros' };
  }
}