import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpendController } from './spend.controller';
import { SpendService } from './spend.service';
import { BudgetModule } from '../budget/budget.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ]),
    BudgetModule
  ],
  controllers: [SpendController],
  providers: [SpendService]
})
export class SpendModule {}
