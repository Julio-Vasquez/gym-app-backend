import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditsController } from './audits.controller';
import { AuditsService } from './audits.service';

import { CreateSuscription } from 'src/entities/audits/createsuscription.entity';
import { CreateUser } from 'src/entities/audits/createuser.entity';
import { UpdateSuscription } from 'src/entities/audits/updatesuscription.entity';
import { UpdateUser } from 'src/entities/audits/updateuser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreateSuscription,
      UpdateSuscription,
      CreateUser,
      UpdateUser,
    ]),
  ],
  controllers: [AuditsController],
  providers: [AuditsService],
})
export class AuditsModule {}
