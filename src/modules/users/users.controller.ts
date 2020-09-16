import { Controller, Body, Post, HttpStatus } from '@nestjs/common';

import { PersonDto } from './dto/person.dto';
import { PersonService } from './services/person.service';

@Controller('users')
export class UsersController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  public async ListClients() {}
  /*
  @Post('signup')
  public async Singup(@Body() account: any) {
    const res = await this.signupService.CreateAccount(account);
    return res.error
      ? { ...res, status: HttpStatus.CONFLICT }
      : { ...res, success: 'ok' };
  }*/

  @Post('create')
  public async CreateClient(@Body() newClient: PersonDto) {
    const res = await this.personService.CreateNewClient(newClient);
    return res.error
      ? { ...res, status: HttpStatus.CONFLICT }
      : { ...res, detail: 'SUCCESSFUL_SIGNUP' };
  }
}
