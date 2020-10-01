import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { People } from 'src/entities/users/people.entity';

@Injectable()
export class FindService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) { }

  public async findByIdentification(identification: number) {
    const res = await this.peopleRepository.findOne({
      where: { identification: identification },
    });

    if (!res || res.name.length < 1)
      return { error: 'NO_CLIENT', detail: 'No records of clients' };

    return res;
  }

  public async findByRoles(role: string) {
    const rol = role.charAt(0).toUpperCase() + role.substr(1).toLowerCase();

    const res = await this.peopleRepository.find({
      where: { role: rol },
      select: ["name", "lastName", "phone", "identification", "dateBirth"]
    });

    if (!res || res.length < 1)
      return { error: 'NO_DATA', detail: 'No records of clients' };

    return res;
  }
}
