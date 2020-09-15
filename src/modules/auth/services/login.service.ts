import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../../entities/users/user.entity';
import { States } from './../../../entities/enums';
import { HashPassword, ComparePassword } from './passEncrypt.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  public async Login(account: LoginDto): Promise<User | any> {
    //const srt: any = await HashPassword('phurion123');
    /*await this.repositoryUser.insert({
      username: 'DarKPhuRioNjulio'.toLowerCase(),
      password: 'julio123',
      key: 'f6a3be4e-cec9-4088-a69c-f33c0d4dafc8'
    });*/

    const response = await this.repositoryUser.findOne({
      where: { username: account.userName.toLowerCase() },
    });

    if (!response)
      return {
        error: 'NO_EXISTS_ACCOUNT',
        detail: 'No existe ninguna cuenta con estas credenciales!.',
      };
    else if (response.state === States.Inactive)
      return {
        error: 'INACTIVE_ACCOUNT',
        detail: 'Cuenta inactiva!.',
      };
    else if (!ComparePassword(account.password, response.password))
      return {
        error: 'NO_MATCH_PASSWORD',
        detail: 'No coincide la contraseña',
      };

    const { password, ...res } = response;

    return this.jwtService.sign({ res });
  }
}
