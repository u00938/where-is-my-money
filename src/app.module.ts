import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UserModule } from '@/modules/user/user.module';
import { ServiceExceptionToHttpExceptionFilter } from '@/loader/exception/error.filter';
import { LoggerModule } from '@/loader/logger.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { BudgetModule } from '@/modules/budget/budget.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { CacheServiceModule } from './cache/cache.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WebhookModule } from '@/modules/webhook/webhook.module';
import { SpendModule } from '@/modules/spend/spend.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(config.db[0]),
    LoggerModule,
    AuthModule,
    UserModule,
    BudgetModule,
    CacheServiceModule,
    WebhookModule,
    SpendModule
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
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ]
})
export class AppModule {}
