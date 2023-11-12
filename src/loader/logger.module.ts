import winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winstonDaily from 'winston-daily-rotate-file'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(config.app.name, { prettyPrint: true }),
          ),
        }),
        new winstonDaily ({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] ${config.app.name}.${info.level}: ${info.message}`,
            ),
          ),
          dirname: process.env.LOG_DIR,
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    }),
  ],
})
export class LoggerModule {}