import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';

import { People } from 'src/entities/users/people.entity';
import { UpdateUser } from 'src/entities/audits/updateuser.entity';
import { UpdatePersonDto } from '../dto/updateperson.dto';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(UpdateUser)
    private readonly updateUserAuditsRepository: Repository<UpdateUser>,
  ) {}

  public async UpdatePerson(
    newClient: UpdatePersonDto,
    user: string,
    oldIdentification: number,
  ) {
    const isExists = await this.peopleRepository.findOne({
      where: { identification: oldIdentification },
    });

    if (!isExists)
      return { error: 'NO_EXISTS_PERSON', detail: 'Sin registros de persona' };

    const duplicate = await this.peopleRepository.findOne({
      where: { identification: newClient.identification },
    });

    if (duplicate)
      return {
        error: 'DUPLICATE_USER',
        detail: 'Ese numero de identificacion pertenece a otra perosna',
      };

    const newPerson = await this.peopleRepository.update(
      { identification: oldIdentification },
      {
        name: newClient.name,
        lastName: newClient.lastName,
        identification: newClient.identification,
        phone: newClient.phone,
        role: newClient.role,
      },
    );

    const personUpdate = await this.peopleRepository.findOne(isExists.id);

    await this.updateUserAuditsRepository.save({
      username: user,
      oldData: { ...isExists },
      newData: { ...personUpdate },
    });

    return newPerson.affected > 0
      ? { success: 'ok' }
      : { error: 'ERROR_UPDATE', detail: 'Proceso de actualización fallida' };
  }
}
