import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { User } from '../../../entities/users/user.entity';
import { States } from '../../../entities/enums/states.enum';
import { ForgotPasswordDto, UpdatePasswordDto } from '../dto/';
import { Mail } from './../../@common/email';
import { HashPassword } from './passEncrypt.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mail: Mail,
  ) { }

  public async RequestForgotPassword(user: ForgotPasswordDto) {
    const account = await this.userRepository.findOne({
      where: { username: user.userName },
    });

    if (!account) {
      return { error: 'NOT_EXIST_USER', detail: 'No existe el Usuario' };
    } else if (account.state !== States.Active) {
      return { error: 'INACTIVE_USER', detail: 'Usuario Inactivo' };
    }
    const privateCode = randomStringGenerator();

    await this.userRepository.update({ id: account.id }, { key: privateCode });

    //token expire in 25minutes
    const token = this.jwtService.sign(
      {
        User: account.username,
        Code: privateCode,
      },
      { expiresIn: 1500 },
    );

    const mail = await this.mail.SendSingleEMailHtml(
      account.mail,
      'Reset Password',
      `127.0.0.1:3000/setnewpassword/${token}`,
      account.username,
      '127.0.0.1:3000', //contact
    );

    return !mail
      ? {
        error: 'ERROR_SEND_EMAIL',
        detail: 'Ocurrio un problema al enviar el email',
      }
      : { success: 'OK' };
  }

  public async ForgotPassword(restore: UpdatePasswordDto) {
    console.log(restore);
    const token: any = this.jwtService.decode(restore.token);
    console.log(token);
    if (!token)
      return {
        error: 'INVALID_TOKEN',
        detail: 'Token invalido, o no encontrado',
      };
    else if (token.exp <= Math.round(new Date().getTime() / 1000))
      return { error: 'TOKEN_EXPIRED', detail: 'token expirado' };

    const checkCode = await this.userRepository.findOne({
      where:{
        key: token.Code,
        username: token.User
      }
    });

    if (!checkCode)
      return {
        error: 'NO_EQUALS_CODE',
        detail: 'Su private code fue cambiado',
      };

    const currentUser = await this.userRepository.findOne({
      where:{
        username: token.User,
        key: token.Code
      }
    });

    console.log(currentUser);
    if (!currentUser)
      return {
        error: 'NO_EXIST_USER',
        detail:
          'No existe usuario con esas credenciales o su private code fue cambiado',
      };
    else if (currentUser.state !== States.Active)
      return { error: 'INACTIVE_USER', detail: 'Usuario Inactivo' };

    const pwd: any = await HashPassword(restore.password);
    
    const result = await this.userRepository.update(
      {
        username: token.User,
        key: token.Code,
      },
      {
        password: pwd,
        key: randomStringGenerator(),
      },
    );

    return result.affected > 0
      ? { success: 'OK' }
      : {
        error: 'NO_UPDATE',
        detail: 'Datos iguales',
      };
  }
}
