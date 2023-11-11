import { Module } from '@nestjs/common';
import { ServiceExceptionToHttpExceptionFilter } from './error.filter';

@Module({
  providers: [
    ServiceExceptionToHttpExceptionFilter
  ],
  exports: [
    ServiceExceptionToHttpExceptionFilter
  ]
})
export class ErrorModule {}
