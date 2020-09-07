import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>
  ) { }

  public async RequestForgotPassword() { }

  public async ForgotPassword() { }
}