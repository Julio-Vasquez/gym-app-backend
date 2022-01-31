import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Connection } from 'typeorm'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'

import { PayDto } from './dto/pay.dto'
import { Suscription } from 'src/entities/users/suscription.entity'
import { People } from 'src/entities/users/people.entity'
import { CreateSuscription } from 'src/entities/audits/createsuscription.entity'
import { UpdateSuscription } from 'src/entities/audits/updatesuscription.entity'
import { Concept } from 'src/entities/enums'
import { RemoveDto } from './dto/remove.dto'

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
  ) {}

  public async MonthlyPayment(pay: PayDto, username: string) {
    const user = await this.peopleRepository.findOne({
      select: ['id', 'name'],
      where: { identification: pay.identification }
    })

    if (!user)
      return { error: 'NO_EXISTS_USER', detail: 'No existe el usuario' }
    const { id } = user

    const suscription = await this.suscriptionRepository.findOne({
      where: { people: id }
    })

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    //Nuevo Primera suscripcion
    if (!suscription) {
      try {
        const insertId = randomStringGenerator()
        await queryRunner.query(`
          INSERT INTO
            suscription
            (
              id,
              cost,
              days,
              debt,
              start,
              end,
              concept,
              fk_people
            )
          VALUES
            (
              '${insertId}',
              ${pay.cost - pay.days},
              ${pay.days},
              ${pay.debt},
              CURRENT_DATE(),
              DATE_ADD(CURRENT_DATE(), INTERVAL ${pay.days} DAY),
              '${Concept.Men}',
              '${id}'
            );
        `)

        await queryRunner.query(`
          INSERT INTO
            payment
            (
              id,
              cost,
              days,
              debt,
              concept,
              username,
              fk_people
            )
          VALUES
          (
            '${insertId}',
            ${pay.cost - pay.debt},
            ${pay.days},
            ${pay.debt},
            '${Concept.Men}',
            '${username}',
            '${id}'
          );
        `)
        await queryRunner.commitTransaction()
        const currenInsert = await this.suscriptionRepository.findOne({
          where: { id: insertId }
        })
        await this.auditCreateSuscription.save({
          username: username,
          data: currenInsert
        })
        return { success: 'ok' }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release()
        return { success: 'ok' }
      }
    }

    //Ya existe una suscripcion
    if (suscription.state === 'active') {
      try {
        await queryRunner.query(`
          UPDATE
            suscription
          SET
            cost = ${pay.cost - pay.days},
            days = ${parseInt(pay.days.toString()) + suscription.days},
            debt = ${pay.debt},
            end = DATE_ADD('${suscription.end}',INTERVAL ${pay.days} DAY)
          WHERE
            id = '${suscription.id}'
        `)
        await queryRunner.query(`
        INSERT INTO
          payment
          (
            id,
            cost,
            days,
            debt,
            concept,
            username,
            fk_people
          )
        VALUES
        (
          '${randomStringGenerator()}',
          ${pay.cost - pay.debt},
          ${pay.days},
          ${pay.debt},
          '${Concept.Men}',
          '${username}',
          '${id}'
        );
        `)
        await queryRunner.commitTransaction()

        const updateSuscriptionReady = await this.suscriptionRepository.findOne(
          {
            where: { id: suscription.id }
          }
        )

        await this.auditUpdateSuscription.save({
          username: username,
          oldData: suscription,
          newData: updateSuscriptionReady
        })

        return { success: 'ok' }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release()
        return { success: 'ok' }
      }
    } else if (suscription.state === 'inactive') {
      //inactiva
      try {
        await queryRunner.query(`
          UPDATE
            suscription
          SET
            cost = ${pay.cost - pay.days},
            days = ${pay.days},
            debt = ${pay.debt},
            end = DATE_ADD(CURRENT_DATE(),INTERVAL ${pay.days} DAY),
            concept = '${Concept.Men}',
            state = 'active'
          WHERE
            id = '${suscription.id}'
        `)
        await queryRunner.query(`
          INSERT INTO
            payment
            (
              id,
              cost,
              days,
              debt,
              concept,
              username,
              fk_people
            )
          VALUES
          (
            '${randomStringGenerator()}',
            ${pay.cost - pay.debt},
            ${pay.days},
            ${pay.debt},
            '${Concept.Men}',
            '${username}',
            '${id}'
          );

        `)
        await queryRunner.commitTransaction()

        const updateSuscriptionReady = await this.suscriptionRepository.findOne(
          {
            where: { id: suscription.id }
          }
        )

        await this.auditUpdateSuscription.save({
          username: username,
          oldData: suscription,
          newData: updateSuscriptionReady
        })

        return { success: 'ok' }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release()
        return { success: 'ok' }
      }
    }
  }

  public async TicketHolderPayment(pay: PayDto, username: string) {
    const user = await this.peopleRepository.findOne({
      select: ['id', 'name'],
      where: { identification: pay.identification }
    })

    if (!user)
      return { error: 'NO_EXISTS_USER', detail: 'No existe el usuario' }
    const { id } = user

    const suscription = await this.suscriptionRepository.findOne({
      where: { people: id }
    })

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    if (!suscription) {
      try {
        const insertId = randomStringGenerator()
        await queryRunner.query(`
          INSERT INTO
            suscription
            (
              id,
              cost,
              days,
              debt,
              start,
              end,
              concept,
              fk_people
            )
          VALUES
            (
              '${insertId}',
              ${pay.cost - pay.debt},
              ${pay.days},
              ${pay.debt},
              CURRENT_DATE(),
              DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY),
              '${Concept.Tiq}',
              '${id}'
            );
        `)

        await queryRunner.query(`
          INSERT INTO
            payment
            (
              id,
              cost,
              days,
              debt,
              concept,
              username,
              fk_people
            )
          VALUES
          (
            '${insertId}',
            ${pay.cost - pay.debt},
            ${pay.days},
            ${pay.debt},
            '${Concept.Tiq}',
            '${username}',
            '${id}'
          );
        `)
        await queryRunner.commitTransaction()
        const currenInsert = await this.suscriptionRepository.findOne({
          where: { id: insertId }
        })
        await this.auditCreateSuscription.save({
          username: username,
          data: currenInsert
        })
        return { success: 'ok' }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release()
        return { success: 'ok' }
      }
    }

    //Ya existe una suscripcion
    if (suscription.state === 'active' && suscription.days > 0) {
      try {
        await queryRunner.query(`
          UPDATE
            suscription
          SET
            cost = ${pay.cost - pay.debt},
            days = ${parseInt(pay.days.toString()) + suscription.days},
            debt = ${pay.debt},
            end = DATE_ADD('${suscription.end}',INTERVAL 30 DAY)
          WHERE
            id = '${suscription.id}'
        `)
        await queryRunner.query(`
        INSERT INTO
          payment
          (
            id,
            cost,
            days,
            debt,
            concept,
            username,
            fk_people
          )
        VALUES
        (
          '${randomStringGenerator()}',
          ${pay.cost - pay.debt},
          ${pay.days},
          ${pay.debt},
          '${Concept.Tiq}',
          '${username}',
          '${id}'
        );
        `)
        await queryRunner.commitTransaction()

        const updateSuscriptionReady = await this.suscriptionRepository.findOne(
          {
            where: { id: suscription.id }
          }
        )

        await this.auditUpdateSuscription.save({
          username: username,
          oldData: suscription,
          newData: updateSuscriptionReady
        })

        return { success: 'ok' }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release()
        return { success: 'ok' }
      }
    } else if (suscription.state === 'inactive') {
      //inactiva
      try {
        await queryRunner.query(`
          UPDATE
            suscription
          SET
            cost = ${pay.cost - pay.debt},
            days = ${pay.days},
            debt = ${pay.debt},
            end = DATE_ADD(CURRENT_DATE(),INTERVAL 30 DAY),
            concept = '${Concept.Tiq}',
            state = 'active'
          WHERE
            id = '${suscription.id}'
        `)
        await queryRunner.query(`
          INSERT INTO
            payment
            (
              id,
              cost,
              days,
              debt,
              concept,
              username,
              fk_people
            )
          VALUES
          (
            '${randomStringGenerator()}',
            ${pay.cost - pay.debt},
            ${pay.days},
            ${pay.debt},
            '${Concept.Tiq}',
            '${username}',
            '${id}'
          );

        `)
        await queryRunner.commitTransaction()

        const updateSuscriptionReady = await this.suscriptionRepository.findOne(
          {
            where: { id: suscription.id }
          }
        )

        await this.auditUpdateSuscription.save({
          username: username,
          oldData: suscription,
          newData: updateSuscriptionReady
        })

        return { success: 'ok' }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release()
        return { success: 'ok' }
      }
    }
  }

  public async RemoveTime(remove: RemoveDto, username: string) {
    const user = await this.peopleRepository.findOne({
      select: ['id', 'name'],
      where: { identification: remove.identification }
    })

    if (!user)
      return { error: 'NO_EXISTS_USER', detail: 'No existe el usuario' }
    const { id } = user

    const suscription = await this.suscriptionRepository.findOne({
      where: { people: id }
    })

    if (!suscription || suscription.state === 'inactive')
      return {
        error: 'NO_SUSCRIPTION',
        detail: 'No hay una suscripcion activa'
      }

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    if (remove.days < suscription.days) {
      let newDays = suscription.days - remove.days
      try {
        if (suscription.concept === Concept.Men) {
          await queryRunner.query(`
          UPDATE
            suscription
          SET
            days = ${newDays},
            end = DATE_ADD('${suscription.end}',INTERVAL -${remove.days} DAY)
          WHERE
            id = '${suscription.id}'
        `)
        } else {
          await queryRunner.query(`
          UPDATE
            suscription
          SET
            days = ${newDays}
          WHERE
            id = '${suscription.id}'
        `)
        }

        await queryRunner.commitTransaction()

        const updateSuscriptionReady = await this.suscriptionRepository.findOne(
          {
            where: { id: suscription.id }
          }
        )

        await this.auditUpdateSuscription.save({
          username: username,
          oldData: suscription,
          newData: updateSuscriptionReady
        })

        return { success: 'ok' }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release()
        return { success: 'ok' }
      }
    } else if (remove.days == suscription.days) {
      try {
        await queryRunner.query(`
          UPDATE
            suscription
          SET
            days = 0,
            end = CURRENT_DATE(),
            state= 'inactive'
          WHERE
            id = '${suscription.id}'
        `)

        await queryRunner.commitTransaction()

        const updateSuscriptionReady = await this.suscriptionRepository.findOne(
          {
            where: { id: suscription.id }
          }
        )

        await this.auditUpdateSuscription.save({
          username: username,
          oldData: suscription,
          newData: updateSuscriptionReady
        })

        return { success: 'ok' }
      } catch (error) {
        await queryRunner.rollbackTransaction()
        return { error: 'FAILED_TRANSATION', detail: error }
      } finally {
        queryRunner.release()
        return { success: 'ok' }
      }
    } else {
      return {
        error: 'NO_TIME',
        detail: 'El tiempo que desea quitar es superior al tiempo acitvo'
      }
    }
  }
}
