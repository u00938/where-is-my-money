import { UserBudget } from '@/model/entities/UserBudget';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import Big from 'big.js';
import { budgetStt, category, spendStt } from './cache.interface';
import { Cron } from '@nestjs/schedule';
import { UserBudgetCategory } from '@/model/entities/UserBudgetCategory';
import calculator from '@/util/calculator';
import { BudgetCategory } from '@/model/entities/BudgetCategory';

@Injectable()
export class CacheService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  // 카테고리 별 예산 통계
  // 자정 1분
  @Cron('0 1 0 * * *')
  async budgetStatistics() {
    this.logger.info('start budget statistics caching');

    const perList = await this.entityManager.connection.query(`
    SELECT bc.name         AS budgetCategoryName,
          Avg(budget_per) AS perAvg
    FROM   user_budget_category ubc
          INNER JOIN budget_category bc
                  ON bc.id = ubc.budget_category_id
    GROUP  BY budget_category_id;    
    `)

    let totalAvg = new Big(0);
    let perObj = [];
    for (let data of perList) {
      // 10% 이하 항목은 하나로 묶기
      if (new Big(data.perAvg).cmp(11) === -1) {
        continue;
      } else {
        const perAvgInt = new Big(data.perAvg).toFixed(0);
        perObj.push(`${data.budgetCategoryName}-${perAvgInt}`);
        totalAvg = totalAvg.plus(perAvgInt);
      }
    }

    perObj.push(`기타-${new Big(100).minus(new Big(totalAvg)).toString()}`);

    // key: budget-stt
    // value: { per: ['식비-14', '취미-43', '주거-13', '기타-30'], date: '2023-11-14' }
    const cacheFormat: budgetStt = {
      per: perObj,
      date: dayjs().format('YYYY-MM-DD')
    }

    await this.cacheManager.set('budget-stt', cacheFormat);

    this.logger.info(`finish budget statistics caching: ${JSON.stringify(cacheFormat)}`);
  }

  // 지출(소비율) 통계
  // 21시 55분
  @Cron('0 55 21 * * *')
  async spendStatistics() {
    this.logger.info('start spend statistics caching');

    // 1. 카테고리별 지출 통계
    const curStatePerCt = await this.entityManager.connection
    .getRepository(UserBudgetCategory)
    .createQueryBuilder('userBudgetCategory')
    .select([
      'budgetCategory.name AS budgetCategoryName',
      'userBudgetCategory.budget AS budget',
      'userBudgetCategory.acc_spend AS accSpend',
      'userBudget.period_start AS periodStart',
      'userBudget.period_end AS periodEnd'
    ])
    .innerJoin(UserBudget, 'userBudget', 'userBudget.id = userBudgetCategory.user_budget_id')
    .innerJoin(BudgetCategory, 'budgetCategory', 'budgetCategory.id = userBudgetCategory.budget_category_id')
    .where(`NOW() BETWEEN userBudget.period_start AND userBudget.period_end`)
    .getRawMany();

    const categoryAvgRate = {}; // { '식비': 80 }
    const categoryCount = {};
    for (let data of curStatePerCt) {
      const spendingRate = calculator.spendingRate(
        data.budget, 
        data.periodStart, 
        data.periodEnd, 
        data.accSpend
      );

      if (!categoryAvgRate[data.budgetCategoryName]) {
        categoryAvgRate[data.budgetCategoryName] = new Big(spendingRate).toString();
        categoryCount[data.budgetCategoryName] = 1;
      } else {
        categoryAvgRate[data.budgetCategoryName] = new Big(categoryAvgRate[data.budgetCategoryName])
        .plus(new Big(spendingRate))
        .toString();
        categoryCount[data.budgetCategoryName] ++;
      }

    }

    for (let [key, value] of Object.entries(categoryAvgRate)) {
      categoryAvgRate[key] = new Big(value)
      .div(categoryCount[key])
      .toFixed(0)
      .toString();
    }

    // 2. 전체 지출 통계
    const curState = await this.entityManager.connection
    .getRepository(UserBudget)
    .createQueryBuilder('userBudget')
    .select([
      'userBudget.budget AS budget',
      'userBudget.acc_spend AS accSpend',
      'userBudget.period_start AS periodStart',
      'userBudget.period_end AS periodEnd'
    ])
    .where(`NOW() BETWEEN userBudget.period_start AND userBudget.period_end`)
    .getRawMany();

    const avgSpendingRate = curState.reduce((acc, cur) => {
      // 소비율 util 사용
      const spendingRate = calculator.spendingRate(
        cur.budget, 
        cur.periodStart, 
        cur.periodEnd, 
        cur.accSpend
      );

      return acc.plus(new Big(spendingRate));
    }, new Big(0)).div(new Big(curState.length)).toFixed(0).toString();

    const cacheFormat: spendStt = {
      totalPer: avgSpendingRate,
      categoryPer: categoryAvgRate,
      date: dayjs().format('YYYY-MM-DD')
    }
    
    await this.cacheManager.set('spend-stt', cacheFormat);

    this.logger.info(`end spending statistics caching - ${JSON.stringify(cacheFormat)}`);
  }

  // 예산 카테고리 캐싱
  async categoryData() {
    const category: Array<category> = await this.entityManager.connection
    .getRepository(BudgetCategory)
    .find();

    await this.cacheManager.set('category', category);

  }
}
