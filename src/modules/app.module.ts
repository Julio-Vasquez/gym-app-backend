import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PgProvider } from './@common/providers/pg.provider';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PgProvider
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
