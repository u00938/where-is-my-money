import { Module } from '@nestjs/common';
import { ErrorModule } from './exception/error.module';

@Module({
  providers: [
    ErrorModule
  ],
  exports: [
    ErrorModule
  ]
})
export class LoaderModule {}
