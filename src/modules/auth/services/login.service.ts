import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { User } from '../../../entities/user.entity';
import { States } from './../../../entities/enums/states.enum';
import { HashPassword, ComparePassword } from './passEncrypt.service';
import { LoginDto } from '../dto/login.dto';


@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>
  ) { }


  public async Login(account: LoginDto) {
    /*const srt: any = await HashPassword('phurion123');
    await this.repositoryUser.save({
      username: 'DarKPhuRioN'.toLowerCase(),
      password: srt,
      key: 'f6a3be4e-cec9-4088-a69c-f33c0d4dafc8'
    });*/
    const { password, userName } = account;
    const response = await this.repositoryUser.findOne({ where: { username: userName.toLowerCase() } });
    if (!response) return { error: 'NO_EXISTS_ACCOUNT', detail: 'No existe ninguna cuenta con estas credenciales!.' };
    else if (response.state === 'inactive') return { error: 'INACTIVE_ACCOUNT', detail: 'Cuenta inactiva!.' };
    else if (!ComparePassword(password, response.password)) return { error: 'NO_MATCH_PASSWORD', detail: 'No coincide la contraseña' };
    return { ...response }
  }
}