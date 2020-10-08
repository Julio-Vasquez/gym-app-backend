import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'

import { PayDto } from './dto/pay.dto';
import { Suscription } from 'src/entities/users/suscription.entity';
import { People } from 'src/entities/users/people.entity';
import { CreateSuscription } from 'src/entities/audits/createsuscription.entity';
import { UpdateSuscription } from 'src/entities/audits/updatesuscription.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Suscription)
    private readonly suscriptionRepository: Repository<Suscription>,
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(CreateSuscription)
    private readonly auditCreateSuscription: Repository<CreateSuscription>,
    @InjectRepository(UpdateSuscription)
    private readonly auditUpdateSuscription: Repository<UpdateSuscription>,
    private readonly connection: Connection
  ) { }

  public async Pay(pay: PayDto) {
    const user = await this.peopleRepository.findOne({
      select: ["id"],
      where: { identification: pay.identification }
    });

    if (!user) return { error: 'NO_EXISTS_USER', detail: 'No existe el usuario' };
    const { id } = user;

    const suscription = await this.suscriptionRepository.findOne({
      where: { people: id }
    });

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    //Nuevo Primera suscripcion
    if (!suscription) {
      try {
        const insertId = randomStringGenerator();
        await queryRunner.query(`
          INSERT INTO
            suscription
            (
              id,
              cost,
              days,
              start,
              end,
              fk_people
            )
          VALUES
            (
              '${insertId}',
              ${pay.cost},
              ${pay.days},
              CURRENT_DATE(),
              DATE_ADD(CURRENT_DATE(), INTERVAL ${pay.days} DAY),
              '${id}'
            );
        `);

        await queryRunner.query(`
          INSERT INTO
            payment
            (
              id,
              cost,
              days,
              username,
              fk_people
            )
          VALUES
          (
            '${insertId}',
            ${pay.cost},
            ${pay.days},
            '${pay.username}',
            '${id}'
          );
        `);
        await queryRunner.commitTransaction();
        const currenInsert = await this.suscriptionRepository.findOne({
          where: { id: insertId }
        })
        await this.auditCreateSuscription.save({
          username: pay.username,
          data: currenInsert
        })
        return { success: 'ok' };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release();
        return { success: 'ok' };
      }
    }

    //Ya existe una suscripcion
    if (suscription.state === 'active') {
      try {
        await queryRunner.query(`
          UPDATE
            suscription
          SET
            cost = ${pay.cost},
            days = ${parseInt(pay.days.toString()) + suscription.days},
            end = DATE_ADD('${suscription.end}',INTERVAL ${pay.days} DAY)
          WHERE
            id = '${suscription.id}'
        `);
        await queryRunner.query(`
        INSERT INTO
          payment
          (
            id,
            cost,
            days,
            username,
            fk_people
          )
        VALUES
        (
          '${randomStringGenerator()}',
          ${pay.cost},
          ${pay.days},
          '${pay.username}',
          '${id}'
        );
        `);
        await queryRunner.commitTransaction();

        const updateSuscriptionReady = await this.suscriptionRepository.findOne({
          where: { id: suscription.id }
        });

        await this.auditUpdateSuscription.save({
          username: pay.username,
          oldData: suscription,
          newData: updateSuscriptionReady
        });

        return { success: 'ok' };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release();
        return { success: 'ok' };
      }

    } else if (suscription.state === 'inactive') {//inactiva
      try {
        await queryRunner.query(`
          UPDATE
            suscription
          SET
            cost = ${pay.cost},
            days = ${pay.days},
            end = DATE_ADD(CURRENT_DATE(),INTERVAL ${pay.days} DAY),
            state = 'active'
          WHERE
            id = '${suscription.id}'
        `);
        await queryRunner.query(`
          INSERT INTO
            payment
            (
              id,
              cost,
              days,
              username,
              fk_people
            )
          VALUES
          (
            '${randomStringGenerator()}',
            ${pay.cost},
            ${pay.days},
            '${pay.username}',
            '${id}'
          );

        `);
        await queryRunner.commitTransaction();

        const updateSuscriptionReady = await this.suscriptionRepository.findOne({
          where: { id: suscription.id }
        });

        await this.auditUpdateSuscription.save({
          username: pay.username,
          oldData: suscription,
          newData: updateSuscriptionReady
        });

        return { success: 'ok' };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release();
        return { success: 'ok' };
      }
    }
  }
}