import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { UserModule } from '@/modules/user/user.module';
import { ServiceExceptionToHttpExceptionFilter } from '@/loader/exception/error.filter';
import { LoggerModule } from '@/loader/logger.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(config.db[0]),
    LoggerModule,
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_FILTER,
      useClass: ServiceExceptionToHttpExceptionFilter
    }
  ]
})
export class AppModule {}
