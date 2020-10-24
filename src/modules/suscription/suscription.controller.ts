import { Body, Controller, Post, Request, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PaymentsService } from './suscription.service';

import { PayDto } from './dto/pay.dto';

@Controller('suscription')
export class SuscriptionController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly jwt: JwtService,
  ) {}

  @Post('pay')
  public async Pay(@Body() pay: PayDto, @Request() req) {
    const user: any = this.jwt.decode(
      req.headers['authorization'].split(' ')[1],
    );
    const res = await this.paymentsService.Pay(pay, user.res.username);

    return res?.error
      ? { ...res, status: HttpStatus.CONFLICT }
      : { ...res, payload: 'Suscripcion modificada' };
  }
}
