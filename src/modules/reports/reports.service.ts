import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { People } from 'src/entities/users/people.entity';
import { DatesDto } from './dto/dates.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async PaysByIdentification(identification: number): Promise<any> {
    const res = await this.peopleRepository
      .createQueryBuilder('people')
      .select([
        'people.name',
        'people.lastName',
        'people.identification',
        'payment.createdAt',
        'payment.cost',
        'payment.debt',
        'payment.concept',
        'payment.days',
        'payment.username',
      ])
      .innerJoin('people.payment', 'payment')
      .where('people.identification = :id', {
        id: identification,
      })
      .getOne();

    if (!res)
      return {
        error: 'NO_PAYS',
        detail: 'No se han realizado pagos para este usuario',
      };

    return res;
  }

  public async PaysByDates(dates: DatesDto): Promise<any> {
    const res = await this.peopleRepository
      .createQueryBuilder('people')
      .select([
        'people.name',
        'people.lastName',
        'people.identification',
        'people.role',
        'payment.createdAt',
        'payment.concept',
        'payment.cost',
        'payment.debt',
        'payment.days',
        'payment.username',
      ])
      .leftJoin('people.payment', 'payment')
      .where('payment.created_at BETWEEN :dateOne AND :dateTwo', {
        dateOne: dates.start,
        dateTwo: dates.end,
      })
      .getMany();

    if (!res || res.length < 1)
      return {
        error: 'NO_PAYS',
        detail: 'No hay pagos de usuarios',
      };

    return res;
  }
}
