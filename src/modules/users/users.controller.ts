import {
  Controller,
  Body,
  Post,
  HttpStatus,
  Get,
  Param,
  HttpException,
} from '@nestjs/common';

import { PersonDto } from './dto/person.dto';
import { CreateService } from './services/create.service';
import { FindService } from './services/find.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createService: CreateService,
    private readonly findService: FindService,
  ) {}

  @Get('list')
  public async ListClients() {
    const res: any = await this.findService.findAll();
    return res.error
      ? { ...res, status: HttpStatus.NO_CONTENT }
      : { payload: res, success: 'ok' };
  }

  @Get('find/:identification')
  public async ListCLientsId(@Param('identification') identification: number) {
    if (!identification || identification < 0) {
      throw new HttpException('Bad_Request', HttpStatus.BAD_REQUEST);
    }
    const res: any = await this.findService.findByIdentification(
      identification,
    );
    return res.error
      ? { ...res, status: HttpStatus.NO_CONTENT }
      : { payload: res, success: 'ok' };
  }

  @Post('create')
  public async CreateClient(@Body() newClient: PersonDto) {
    const res = await this.createService.CreateNewClient(newClient);
    return res.error
      ? { ...res, status: HttpStatus.CONFLICT }
      : { ...res, detail: 'SUCCESSFUL_SIGNUP' };
  }
}
