import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';

import { People } from 'src/entities/users/people.entity';
import { PersonDto } from '../dto/person.dto';
import { UpdateUser } from 'src/entities/audits/updateuser.entity';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(UpdateUser)
    private readonly updateUserAuditsRepository: Repository<UpdateUser>,
  ) {}

  public async UpdatePerson(newClient: PersonDto, user: string) {
    const isExists = await this.peopleRepository.findOne({
      where: { identification: newClient.identification },
    });

    if (!isExists)
      return { error: 'NO_EXISTS_PERSON', detail: 'No records of person' };

    const newPerson = await this.peopleRepository.update(
      { identification: newClient.identification },
      { ...newClient },
    );

    const personUpdate = await this.peopleRepository.findOne(isExists.id);

    await this.updateUserAuditsRepository.save({
      username: user,
      oldData: { ...isExists },
      newData: { ...personUpdate },
    });

    return newPerson.affected > 0
      ? { success: 'ok' }
      : { error: 'ERROR_UPDATE', detail: 'update process failed' };
  }
}
