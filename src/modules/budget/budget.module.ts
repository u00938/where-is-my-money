import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { UserBudget } from '@/model/entities/UserBudget';
import { CacheServiceModule } from '@/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserBudget
    ]),
    CacheServiceModule
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService]
})
export class BudgetModule {}
