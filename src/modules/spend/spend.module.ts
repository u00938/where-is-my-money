import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpendController } from './spend.controller';
import { SpendService } from './spend.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ])
  ],
  controllers: [SpendController],
  providers: [SpendService]
})
export class SpendModule {}
