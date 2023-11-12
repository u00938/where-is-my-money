import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
const conf = `.${process.env.NODE_ENV}.env`;
const env = dotenv.config({ path: conf });
if (env.error) {
  throw new Error('Couldn\'t find .env file');
}

export default {
  port: process.env.NODE_PORT,
  db: [
    {
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [process.env.TYPEORM_ENTITIES]
    } as TypeOrmModuleOptions
  ],
  proxy: {

  },
  token: {
    accessTokenSecret: process.env.NODE_ENV === 'prod' ? process.env.ACCESS_TOKEN_SECRET : 'wow~~',
    accessTokenExp: process.env.NODE_ENV === 'prod' ? process.env.ACCESS_TOKEN_EXP : 5000
  },
  app: {
    name: process.env.APP_NAME
  }
}