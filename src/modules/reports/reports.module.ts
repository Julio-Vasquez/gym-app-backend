import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

import { People } from 'src/entities/users/people.entity';

@Module({
  imports: [TypeOrmModule.forFeature([People])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
