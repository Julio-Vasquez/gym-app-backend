import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { User } from '../../../entities/users/user.entity';
import { SignupDto } from '../dto';
import { States } from '../../../entities/enums';

@Injectable()
export class SignupService {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
  ) { }

  public async CreateAccount(newAccount: SignupDto): Promise<boolean | any> {
    const isExists = await this.repositoryUser.findOne({
      where: { username: newAccount.username },
    });
    if (isExists)
      return {
        error: 'EXISTING_USER',
        detail: 'Ya existe el usuario que desea registrar',
      };

    await getManager().transaction(async entityManager => {
      await entityManager.save(
        await this.repositoryUser.create({
          key: randomStringGenerator(),
          password: newAccount.password,
          username: newAccount.username,
        }),
      );
      return { detail: 'SUCCESSFUL_SIGNUP' };
    });
  }
}
