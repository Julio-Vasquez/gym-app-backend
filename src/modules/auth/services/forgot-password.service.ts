import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { User } from '../../../entities/users/user.entity';
import { States } from '../../../entities/enums/states.enum';
import { ForgotPasswordDto } from '../dto/';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async RequestForgotPassword(user: ForgotPasswordDto) {
    const account = await this.repositoryUser.findOne({
      where: { username: user.userName },
    });

    if (!account) {
      return { error: 'NOT_EXIST_USER', detail: 'No existe el Usuario' };
    } else if (account.state !== States.Active) {
      return { error: 'INACTIVE_USER', detail: 'Usuario Inactivo' };
    }
    const privateCode = randomStringGenerator();

    await this.repositoryUser.update({ id: account.id }, { key: privateCode });

    //token expire in 25minutes
    const token = this.jwtService.sign(
      {
        ID: account.id,
        User: account.username,
        Code: privateCode,
      },
      { expiresIn: 1500 },
    );
    /*
        const mail = await this.mail.SendSingleEMailHtml(
          account.email,
          'Reset Password',
          `${this.config.get<string>('app.client_Host')}/setnewpassword/${token}`,
          account.userName,
          this.config.get<string>('app.client_Host'),
        );
    
        return !mail
          ? {
            error: 'ERROR_SEND_EMAIL',
            detail: 'Ocurrio un problema al enviar el email',
          }
          : { success: 'OK' };*/
    return {};
  }

  public async ForgotPassword(token: string) {}
}
