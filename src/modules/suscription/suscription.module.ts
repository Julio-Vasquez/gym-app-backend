import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuscriptionController } from './suscription.controller';
import { PaymentsService } from './suscription.service'

import { Suscription } from 'src/entities/users/suscription.entity';
import { People } from 'src/entities/users/people.entity';
import { CreateSuscription } from 'src/entities/audits/createsuscription.entity';
import { UpdateSuscription } from 'src/entities/audits/updatesuscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      Suscription,
      People,
      CreateSuscription,
      UpdateSuscription
    ]
  )],
  controllers: [SuscriptionController],
  providers: [PaymentsService],
})
export class SuscriptionModule { };