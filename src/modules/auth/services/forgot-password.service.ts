import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { User } from '../../../entities/users/user.entity';
import { States } from '../../../entities/enums/states.enum';
import { ForgotPasswordDto } from '../dto/';
import { Mail } from './../../@common/email';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mail: Mail,
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

    const mail = await this.mail.SendSingleEMailHtml(
      account.mail,
      'Reset Password',
      `urlClientSetNewPassword`,
      account.username,
      'hostClient', //contact
    );

    return !mail
      ? {
          error: 'ERROR_SEND_EMAIL',
          detail: 'Ocurrio un problema al enviar el email',
        }
      : { success: 'OK' };
  }

  public async ForgotPassword(restore: string) {
    console.log(restore);
    const token: any = this.jwt.decode(restore.token);
    console.log(token);
    if (!token)
      return {
        error: 'INVALID_TOKEN',
        detail: 'Token invalido, o no encontrado',
      };
    else if (token.exp <= Math.round(new Date().getTime() / 1000))
      return { error: 'TOKEN_EXPIRED', detail: 'token expirado' };

    const checkCode = await this.UserModel.findOne({
      _id: token.ID,
      code: token.Code,
    }).exec();

    if (!checkCode)
      return {
        error: 'NO_EQUALS_CODE',
        detail: 'Su private code fue cambiado',
      };

    const currentUser = await this.UserModel.findOne({
      _id: token.ID,
      userName: token.User.toUpperCase(),
      code: token.Code,
    }).exec();

    console.log(currentUser);
    if (!currentUser)
      return {
        error: 'NO_EXIST_USER',
        detail:
          'No existe usuario con esas credenciales o su private code fue cambiado',
      };
    else if (currentUser.state !== State.Active)
      return { error: 'INACTIVE_USER', detail: 'Usuario Inactivo' };

    const privateCode = randomStringGenerator();

    const result = await this.UserModel.updateOne(
      {
        _id: token.ID,
        username: token.User.toUpperCase(),
        code: token.Code,
      },
      {
        password: await HashPassword(restore.password),
        code: privateCode,
      },
    ).exec();

    return result.nModified > 0
      ? { success: 'OK' }
      : {
          error: 'NO_UPDATE',
          detail: 'Datos iguales',
        };
  }
}
