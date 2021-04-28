import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../entities/users/user.entity';

const USERS = [
  {
    id: '146c3fd6-fd3b-4c0a-ad66-0869ed05f100',
    username: 'pulido'.toLowerCase(),
    password: '451504911110010510811711296495150491111001051081171124',
    key: '9872c96a-7b13-4bf9-88cd-5965f3df61f7',
    mail: 'lucho9515baco@gmail.com',
    people: '7c556aca-72ba-4d3d-8f0e-dd57ff0869ef',
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
