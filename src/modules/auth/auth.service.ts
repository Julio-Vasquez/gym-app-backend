import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { User } from './../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) { }

  public async Login() {
    await this.repository.insert({
      key: randomStringGenerator(),
      username: 'DarKPhuRioN',
      password: 'pwd'
    });
    return await this.repository.find();
  }
}