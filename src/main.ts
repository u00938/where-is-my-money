process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '@/config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@/loader/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true }
  );

  app.enable('trust proxy');
  app.use(helmet());
  app.setGlobalPrefix('/api');
  app.use(morgan('combined'));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app); // {host:post}/api-docs

  await app.listen(config.port)
    .then(async () => {
      console.info(`server running on ${await app.getUrl()}`);
    })
    .catch((err) => {
      process.exit(1);
    })

  return app;
}

bootstrap();
