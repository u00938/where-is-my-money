import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { UserBudget } from '@/model/entities/UserBudget';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserBudget
    ])
  ],
  controllers: [BudgetController],
  providers: [BudgetService]
})
export class BudgetModule {}
