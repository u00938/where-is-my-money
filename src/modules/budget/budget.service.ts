import {
  Inject,
  Injectable
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EntityManager, Repository } from 'typeorm';
import { BadRequestValueException, ServerErrorException } from '@/loader/exception/error.service';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBudget } from '@/model/entities/UserBudget';
import { User } from '@/model/entities/User';
import { BudgetCategory } from '@/model/entities/BudgetCategory';
import { UserSpendHistory } from '@/model/entities/UserSpendHistory';
import Big from 'big.js';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from '@/cache/cache.service';
import { budgetStt, category } from '@/cache/cache.interface';

@Injectable()
export class BudgetService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly entityManager: EntityManager,
    @InjectRepository(UserBudget)
    private userBudgetRepository: Repository<UserBudget>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private cacheService: CacheService
  ) {}

  // 예산 설정
  async setBudget(currentUser, setBudgetDto): Promise<object> {
    try {
      // TODO: 트랜잭션 묶기 -> roll back
      const today = dayjs().format('YYYY-MM-DD');
      const validPeriodStart = dayjs(setBudgetDto.periodStart).isSameOrAfter(today);

      if (!validPeriodStart) {
        throw BadRequestValueException(`시작 날짜가 유효하지 않습니다\n다시 입력해주세요`);
      }

      const periodEnd = dayjs(setBudgetDto.periodStart).add(1, 'M').format('YYYY-MM-DD');
      
      const insertBudget = await this.entityManager.connection.query(`
      SELECT insert_user_budget(?, ?, ?, ?) AS _id
      `, [
        currentUser.id,
        setBudgetDto.budget,
        setBudgetDto.periodStart,
        periodEnd
      ])

      if (insertBudget[0]._id.indexOf('USBG') === -1) {
        throw BadRequestValueException(`예산 설정 실패/n다시 시도해주세요`);
      }
      
      for (let data of setBudgetDto.categoryBudget) {
        const {
          budgetCategoryId,
          budget
        } = data;
        
        const per = (new Big(budget).div(new Big(setBudgetDto.budget))).times(100).toFixed(0);

        await this.entityManager.connection.query(`
        SELECT insert_user_budget_category(?, ?, ?, ?) AS _id
        `, [
          insertBudget[0]._id,
          budgetCategoryId,
          budget,
          per
        ])

      }

      return { message: `예산이 설정되었습니다` }
    } catch (e) {
      throw e;
    }
  }

  async getCategory(): Promise<Array<category>> {
    let category: Array<category> = await this.cacheManager.get('category');

    if (!category) {
      await this.cacheService.categoryData();
      category = await this.cacheManager.get('category');
    }

    return category;
  }

  // 예산 추천
  async getBudgetRecommendation(query): Promise<object> {
    try {
      const { budget } = query;
      let budgetStt: budgetStt = await this.cacheManager.get('budget-stt');

      if (!budgetStt ||
        (budgetStt && budgetStt.date !== dayjs().format('YYYY-MM-DD'))) {
        await this.cacheService.budgetStatistics();
        budgetStt = await this.cacheManager.get('budget-stt');
      }

      // TODO: 2차 확인 후에도 채워지지 않는다면 에러 대신 랜덤으로 짜주는 것도 괜찮을까?

      const budgetCal = budgetStt.per.map(data => {
        const [category, perNum] = data.split('-');
        return `${category}-${new Big(budget).times(new Big(perNum).div(100))}`;
      })

      return { result: budgetCal };
    } catch (e) {
      throw e;
    }
  }

  // 더미 데이터 생성
  async testData(): Promise<void> {
    // 유저 []
    const users = await this.entityManager.connection
    .getRepository(User).find();

    // 카테고리 []
    const categories = await this.entityManager.connection
    .getRepository(BudgetCategory).find();

    const categoryNames = categories.map(data => data.id);
    const today = dayjs().format('YYYY-MM-DD');

    for (let user of users) {
      // insert budget
      // 카테고리 랜덤 섞고 랜덤 갯수 뽑기(3개 이하)
      const shuffleCt = [...categoryNames].sort(() => Math.random() - 0.5);
      const randomCt = shuffleCt.slice(0, Math.floor((Math.random() * 3) + 1));

      const periodStart = dayjs(today).subtract(Math.floor(Math.random() * 10), 'd').format('YYYY-MM-DD')
      const periodEnd = dayjs(periodStart).add(1, 'M').format('YYYY-MM-DD')

      const totalBudget = 1000000;

      const insertBudget = await this.entityManager.connection.query(`
      SELECT insert_user_budget(?, ?, ?, ?) AS _id
      `, [
        user.id,
        totalBudget,
        periodStart,
        periodEnd
      ])

      // insert budget, spend history
      for (let ct of randomCt) {
        const budget = (Math.floor(Math.random() * 20) + 1).toString().padEnd(6, '0');
        const per = (new Big(budget).div(new Big(totalBudget))).times(100).toFixed(0);

        const insertBudgetCt = await this.entityManager.connection.query(`
        SELECT insert_user_budget_category(?, ?, ?, ?) AS _id
        `, [
          insertBudget[0]._id,
          ct,
          budget,
          per
        ])

        // 랜덤 지출 ..
        const num = new Array(Math.floor(Math.random() * 3) + 1).fill({})
        const value = num.map(() => {
          return {
            id: '',
            userBudgetCategoryId: insertBudgetCt[0]._id,
            spendAmount: (Math.floor(Math.random() * 10) + 1).toString().padEnd(5, '0'),
            spendDate: dayjs(today).add(Math.floor(Math.random() * 10), 'd').format('YYYY-MM-DD')
          }
        })

        await this.entityManager.connection
        .createQueryBuilder()
        .insert()
        .into(UserSpendHistory)
        .values(value)
        .execute()

      }

    }
  }
}