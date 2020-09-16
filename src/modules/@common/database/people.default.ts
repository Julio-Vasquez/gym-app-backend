import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { People } from '../../../entities/users/people.entity';

const PEOPLES = [
  {
    id: '7c556aca-72ba-4d3d-8f0e-dd57ff0869ef',
    name: 'Fernando',
    lastName: 'Pulido',
    identification: 12345,
    dateBirth: '1990-01-01',
    phone: 3143516889,
    gender: 'Masculino',
    role: 'Admin',
  },
  {
    id: 'c1f8dd00-7aad-437e-8029-b44faa06f107',
    name: 'Carlos',
    lastName: 'Rojas',
    identification: 12345,
    dateBirth: '1990-02-01',
    phone: 3143516887,
    gender: 'Masculino',
    role: 'Admin',
  },
];

export class PeopleDefault {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {
    PEOPLES.map(people => this.createDefault(people));
  }

  public async createDefault(object) {
    const isExists = await this.peopleRepository.findOne({
      where: {
        identification: object.identification,
        phone: object.phone,
      },
    });
    if (isExists) return;

    const _new = this.peopleRepository.create(object);

    return await this.peopleRepository.save(_new);
  }
}
