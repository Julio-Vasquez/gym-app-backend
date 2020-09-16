import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { People } from 'src/entities/users/people.entity';
import { PersonDto } from '../dto/person.dto';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async UpdatePerson(newClient: PersonDto) {
    const isExists = await this.peopleRepository.findOne({
      where: { identification: newClient.identification },
    });

    if (!isExists)
      return { error: 'NO_EXISTS_PERSON', detail: 'No records of person' };

    const newPerson = await this.peopleRepository.update(
      { identification: newClient.identification },
      {
        name: newClient.name,
        lastName: newClient.lastName,
        dateBirth: newClient.dateBirth,
        phone: newClient.phone,
        gender: newClient.gender,
        role: newClient.rol,
      },
    );
    return newPerson.affected > 0
      ? { success: 'ok' }
      : { error: 'ERROR_UPDATE', detail: 'update process failed' };
  }
}
