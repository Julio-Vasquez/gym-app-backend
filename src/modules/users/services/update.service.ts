import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { People } from 'src/entities/users/people.entity';
import { UpdateUser } from 'src/entities/audits/updateuser.entity';

import { UpdatePersonDto } from '../dto/updateperson.dto';
import { Payment } from 'src/entities/users/payment.entity';
import { Suscription } from 'src/entities/users/suscription.entity';

import { Concept } from './../../../entities/enums/concept.enum';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(UpdateUser)
    private readonly updateUserAuditsRepository: Repository<UpdateUser>,
    @InjectRepository(Payment)
    private readonly paymentRespository: Repository<Payment>,
    @InjectRepository(Suscription)
    private readonly suscriptionRepository: Repository<Suscription>,
  ) {}

  public async UpdatePerson(
    newClient: UpdatePersonDto,
    user: string,
    oldIdentification: number,
  ) {
    //verificar los identification dado que puede que no se cambie
    const isExists = await this.peopleRepository.findOne({
      where: { identification: oldIdentification },
    });

    if (!isExists)
      return { error: 'NO_EXISTS_PERSON', detail: 'Sin registros de persona' };

    const debtTemp = await this.suscriptionRepository.findOne({
      where: {
        people: isExists.id,
      },
    });
    //modifcamos la mora
    await this.suscriptionRepository.update(
      {
        id: debtTemp.id,
      },
      {
        debt: newClient.debt,
      },
    );
    //debia=20000 pago(client) 10000
    if (newClient.debt < debtTemp.debt) {
      let t: number = debtTemp.debt - newClient.debt;
      await this.paymentRespository.save({
        concept: Concept.Abo,
        cost: newClient.debt,
        days: 0,
        debt: t,
        username: user,
        people: isExists,
      });
    } else {
      await this.paymentRespository.save({
        concept: Concept.Abo,
        cost: debtTemp.debt,
        days: 0,
        debt: 0,
        username: user,
        people: isExists,
      });
    }

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
