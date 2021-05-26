import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DBProvider implements TypeOrmOptionsFactory {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: '127.0.0.1',
      port: +3306,
      username: 'root',
      password: 'phurion123',
      database: 'gymdb',
      synchronize: true,
      logging: true,
      entities: ['dist/entities/**/*entity.js'],
    };
  }
}
