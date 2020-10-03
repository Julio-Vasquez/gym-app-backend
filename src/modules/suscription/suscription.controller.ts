import { Body, Controller, Post } from '@nestjs/common';

import { PaymentsService } from './suscription.service';

import { PayDto } from './dto/pay.dto';

@Controller('suscription')
export class SuscriptionController {
  constructor(
    private readonly paymentsService: PaymentsService
  ) { }

  @Post('pay')
  public async Pay(@Body() pay: PayDto) {
    const res = await this.paymentsService.Pay(pay);
  }
}