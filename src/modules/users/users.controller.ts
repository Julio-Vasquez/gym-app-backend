import {
  Controller,
  Body,
  Post,
  HttpStatus,
  Get,
  Param,
  HttpException,
  Put,
  ParseIntPipe,
  Request,
} from '@nestjs/common';

import { PersonDto } from './dto/person.dto';
import { CreateService } from './services/create.service';
import { FindService } from './services/find.service';
import { UpdateService } from './services/update.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createService: CreateService,
    private readonly findService: FindService,
    private readonly updateService: UpdateService,
  ) {}

  @Get('list')
  public async ListClients() {
    const res: any = await this.findService.findAll();
    return res.error
      ? { ...res, status: HttpStatus.NO_CONTENT }
      : { payload: res, success: 'ok' };
  }

  @Get('find-:identification')
  public async ListCLientsId(
    @Param('identification', ParseIntPipe) identification: number,
  ) {
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

  @Get('find/:role')
  public async ListCLientsRole(@Param('role') role: string) {
    if (!role || role.length < 0) {
      throw new HttpException('Bad_Request', HttpStatus.BAD_REQUEST);
    }
    const res: any = await this.findService.findByRoles(role);
    return res.error
      ? { ...res, status: HttpStatus.NO_CONTENT }
      : { payload: res, success: 'ok' };
  }

  @Post('create')
  public async CreateClient(@Body() newClient: PersonDto, @Request() req) {
    const res = await this.createService.CreateNewClient(
      newClient,
      req.headers['authorization'].split(' ')[1],
    );
    return res?.error
      ? { ...res, status: HttpStatus.CONFLICT }
      : { ...res, detail: 'Successful signup' };
  }

  @Put('update')
  public async UpdatePerson(@Body() newPerson: PersonDto, @Request() req) {
    const res = await this.updateService.UpdatePerson(
      newPerson,
      req.headers['authorization'].split(' ')[1],
    );
    return res.error
      ? { ...res, status: HttpStatus.NO_CONTENT }
      : { ...res, detail: 'Sucessful update' };
  }
}
