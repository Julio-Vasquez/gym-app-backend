import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { People } from 'src/entities/users/people.entity';
import { Concept } from 'src/entities/enums';
import { Suscription } from 'src/entities/users/suscription.entity';

@Injectable()
export class FindService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Suscription)
    private readonly suscriptionRepository: Repository<Suscription>,
  ) {}
  //que se devuelva si debe o no
  public async findByIdentification(identification: number) {
    const res = await this.peopleRepository
      .createQueryBuilder('people')
      .select([
        'name',
        'lastName',
        'phone',
        'identification',
        'role',
        "CONCAT(dateBirth,'') as dateBirth",
        'suscription.concept as concept',
        'suscription.debt as debt',
        'suscription.days AS time',
        'suscription.end AS end',
        'suscription.state AS state',
      ])
      .leftJoin('people.suscription', 'suscription')
      .where('people.identification = :identification', {
        identification: identification,
      })
      .execute();

    if (!res[0] || res[0].name.length < 1)
      return { error: 'NO_CLIENT', detail: 'No hay resultados de clientes' };

    return res[0];
  }
  //que se devuelva si debe o no
  public async findByIdentificationEntry(identification: number) {
    const res = await this.peopleRepository
      .createQueryBuilder('people')
      .select([
        'name',
        'lastName',
        'phone',
        'identification',
        'role',
        "CONCAT(dateBirth,'') as dateBirth",
        'suscription.days AS time',
        'suscription.debt as debt',
        'suscription.end AS end',
        'suscription.concept as concept',
        'suscription.updatedAt as upd',
        'suscription.state AS state',
      ])
      .leftJoin('people.suscription', 'suscription')
      .where('people.identification = :identification', {
        identification: identification,
      })
      .execute();

    if (!res[0] || res[0].name.length < 1)
      return { error: 'NO_CLIENT', detail: 'No hay resultados de clientes' };

    if (res[0].concept === Concept.Tiq && res[0].time > 0) {
      const userDate = new Date(`${res[0].upd}`).toISOString().slice(0, 10),
        currentDate = new Date().toISOString().slice(0, 10);

      if (userDate < currentDate) {
        const idPeople = await this.peopleRepository.findOne({
          where: { identification: res[0].identification },
        });

        const updateSuscription = await this.suscriptionRepository.update(
          { people: idPeople },
          { days: res[0].time - 1 },
        );

        if (updateSuscription.affected > 0) return res[0];
        else
          return {
            error: 'Error',
            detail: 'No se pudo actualizar la tiquetera',
          };
      }
    }

    return res[0];
  }

  public async findByRoles(role: string) {
    const rol = role.charAt(0).toUpperCase() + role.substr(1).toLowerCase();

    const response = await this.peopleRepository
      .createQueryBuilder('people')
      .select([
        'name',
        'lastName',
        'phone',
        'identification',
        "COALESCE(suscription.state, ' ') AS state",
        "CONCAT(suscription.end,'') AS end",
      ])
      .leftJoin('people.suscription', 'suscription')
      .where('people.role = :role', { role: rol })
      .execute();

    if (!response || response.length < 1)
      return { error: 'NO_DATA', detail: 'No hay resultados de clientes' };

    return response;
  }
}
