import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { People } from 'src/entities/users/people.entity';
import { CreateUser } from 'src/entities/audits/createuser.entity';
import { PersonDto } from '../dto/person.dto';

@Injectable()
export class CreateService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(CreateUser)
    private readonly createUserAuditsRepository: Repository<CreateUser>,
  ) {}

  public async CreateNewClient(newClient: PersonDto, user: string) {
    const isExists = await this.peopleRepository.findOne({
      where: { identification: newClient.identification },
    });

    if (isExists)
      return {
        error: 'EXISTS_USER',
        detail: 'El cliente que desea crear ya está registrado',
      };

    if (newClient.dateBirth === '') {
      newClient = { ...newClient, dateBirth: null };
    }

    const client = await this.peopleRepository.save({
      ...newClient,
    });

    await this.createUserAuditsRepository.save({
      data: { ...client },
      username: user,
    });

    return client
      ? { success: 'ok' }
      : { error: 'ERROR', detail: 'proceso desconocido falló' };
  }
}
