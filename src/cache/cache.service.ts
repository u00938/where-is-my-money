import { ServerErrorException } from '@/loader/exception/error.service';
import { UserBudget } from '@/model/entities/UserBudget';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import Big from 'big.js';
import { budgetStt } from './cache.interface';
import { Cron } from '@nestjs/schedule';

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
  async budgetPer() {
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
      date: '2023-11-14'
    }

    await this.cacheManager.set('budget-stt', cacheFormat);

    this.logger.info('finish budget statistics caching');
  }

}
