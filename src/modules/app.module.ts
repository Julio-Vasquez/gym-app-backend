import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DBProvider } from './@common/providers/db.provider';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './@common/common.module';
import { SuscriptionModule } from './suscription/suscription.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DBProvider,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    SuscriptionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
