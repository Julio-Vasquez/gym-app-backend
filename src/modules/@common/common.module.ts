/*import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import typeormConfig from './config/typeorm.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.cwd() + '/.env',
      load: [appConfig, typeormConfig]
    })
  ],
  controllers: [],
  providers: [],
})
export class CommonModule { }*/