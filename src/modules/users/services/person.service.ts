import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { People } from 'src/entities/users/people.entity';
import { PersonDto } from '../dto/person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async CreateNewClient(newClient: PersonDto) {
    const isExists = await this.peopleRepository.findOne({
      where: { identification: newClient.identification },
    });

    if (isExists)
      return {
        error: 'EXISTS_USER',
        detail: 'the client you want to create is already registered',
      };

    const client = await this.peopleRepository.insert({
      name: newClient.name,
      lastName: newClient.lastName,
      identification: newClient.identification,
      dateBirth: newClient.dateBirth,
      phone: newClient.phone,
      gender: newClient.gender,
    });
    return client
      ? { success: 'ok' }
      : { error: 'ERROR', detail: 'unknown process failed' };
  }
}
