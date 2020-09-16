import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PgProvider } from './@common/providers/pg.provider';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './@common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PgProvider,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
