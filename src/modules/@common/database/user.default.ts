import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../entities/users/user.entity';

const USERS = [
  {
    id: '146c3fd6-fd3b-4c0a-ad66-0869ed05f100',
    username: 'pulido',
    password: '123123',
    key: '9872c96a-7b13-4bf9-88cd-5965f3df61f7',
    people: '7c556aca-72ba-4d3d-8f0e-dd57ff0869ef',
  },
  {
    id: 'c66446ad-e580-433a-a7d1-22350a8b57f8',
    username: 'carlos',
    password: '123123',
    key: 'e5552f6a-bf3b-4205-a0c5-070a99fe8c82',
    people: 'c1f8dd00-7aad-437e-8029-b44faa06f107',
  },
];
export class UserDefault {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    USERS.map(user => this.createDefault(user));
  }

  public async createDefault(object) {
    const isExists = await this.userRepository.findOne({
      where: { key: object.key, id: object.id },
    });
    if (isExists) return;

    const _new = this.userRepository.create(object);

    return await this.userRepository.save(_new);
  }
}
