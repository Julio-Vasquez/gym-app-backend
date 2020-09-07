import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('login')
  public async Login() {
    const res = await this.authService.Login();

    if (res.length > 0) return { ...res };
    return { error: 'No registros' };
  }
}