import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSuscription } from 'src/entities/audits/createsuscription.entity';
import { CreateUser } from 'src/entities/audits/createuser.entity';
import { UpdateSuscription } from 'src/entities/audits/updatesuscription.entity';
import { UpdateUser } from 'src/entities/audits/updateuser.entity';

@Injectable()
export class AuditsService {
  constructor(
    @InjectRepository(CreateUser)
    private readonly createUserAudits: Repository<CreateUser>,
    @InjectRepository(CreateSuscription)
    private readonly createSuscriptionAudits: Repository<CreateSuscription>,
    @InjectRepository(UpdateUser)
    private readonly updateUserAudits: Repository<UpdateUser>,
    @InjectRepository(UpdateSuscription)
    private readonly updateSuscriptionAudits: Repository<UpdateSuscription>,
  ) {}
}
