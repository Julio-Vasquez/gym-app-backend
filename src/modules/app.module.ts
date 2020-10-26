import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DBProvider } from './@common/providers/db.provider';

import { CommonModule } from './@common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SuscriptionModule } from './suscription/suscription.module';
import { AuditsModule } from './audits/audits.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DBProvider,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    SuscriptionModule,
    AuditsModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
