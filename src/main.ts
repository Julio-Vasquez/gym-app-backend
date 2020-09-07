import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './modules/app.module';

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('cg');

  const PORT: number = parseInt(process.env.PORT) || 8550;
  await app.listen(PORT, '0.0.0.0', () => {
    Logger.log(
      `🔥  App Name : Cool Gym 🔥`,
      'Logger-App-Name',
    );
    Logger.log(
      `🎓  Mode : dev 🎓`,
      'Logger-App-Mode',
    );
    Logger.log(
      `🚀  Server Running on 127.0.0.1:${PORT}/cg/ 🚀 `,
      'Logger-Server-Running',
    );
  });
}

bootstrap();