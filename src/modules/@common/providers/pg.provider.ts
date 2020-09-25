import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class PgProvider implements TypeOrmOptionsFactory {

  constructor() { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: '127.0.0.1',
      port: +5432,
      username: 'postgres',
      password: 'phurion123',
      database: 'gymdb',
      synchronize: true,
      logging: true,
      entities: ['dist/entities/**/*entity.js'],
      /*ssl: {
        rejectUnauthorized: false
      }*/
    };
  }
}