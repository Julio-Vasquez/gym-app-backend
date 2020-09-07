import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class PgProvider implements TypeOrmOptionsFactory {

  constructor() { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: 'ec2-50-19-26-235.compute-1.amazonaws.com',
      port: +5432,
      username: 'syssclupdwomgz',
      password: 'd70e51f615900b8221ee82985e67085a05561f5958cfd704b4e1055f33db56e3',
      database: 'dbdpa65rl979h4',
      synchronize: true,
      logging: true,
      entities: ['dist/entities/**/*entity.js'],
      ssl: {
        rejectUnauthorized: false
      }
    };
  }
}