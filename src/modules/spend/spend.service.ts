import {
  Inject,
  Injectable
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EntityManager, Repository } from 'typeorm';
import { BadRequestValueException, ServerErrorException } from '@/loader/exception/error.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBudget } from '@/model/entities/UserBudget';
import { UserBudgetCategory } from '@/model/entities/UserBudgetCategory';
import { UserSpendHistory } from '@/model/entities/UserSpendHistory';
import { BudgetService } from '../budget/budget.service';

@Injectable()
export class SpendService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly entityManager: EntityManager,
    private budgetService: BudgetService
  ) {}

  // 지출 생성
  async addSpend(currentUser, addSpendDto): Promise<object> {
    try {
      const {
        userBudgetCategoryId,
        spendAmount,
        description,
        isSum,
        spendDate
      } = addSpendDto;

      const userBudget = await this.entityManager.connection
      .getRepository(UserBudgetCategory)
      .createQueryBuilder('userBudgetCategory')
      .select([
        'userBudgetCategory.id AS userBudgetCategoryId'
      ])
      .innerJoin(
        UserBudget, 
        'userBudget', 
        `userBudget.id = userBudgetCategory.user_budget_id
        AND userBudget.user_id = "${currentUser.id}"`
      )
      .where('userBudgetCategory.id = :userBudgetCategoryId', { userBudgetCategoryId })
      .getRawOne();

      if (!userBudget) {
        throw BadRequestValueException(`예산을 먼저 설정해주세요`);
      }

      const insertSpend = await this.entityManager.connection.query(`
      SELECT insert_user_spend_history(?, ?, ?, ?, ?) AS _id
      `, [
        userBudgetCategoryId,
        spendAmount,
        description,
        spendDate,
        isSum
      ])

      if (insertSpend[0]._id.indexOf('UEPH') === -1) {
        throw BadRequestValueException(`지출 등록 실패/n다시 시도해주세요`);
      }

      return { message: `예산이 설정되었습니다` }
    } catch (e) {
      throw e;
    }
  }

  async getSpendList(currentUser, getSpendListQueryDto): Promise<object> {
    try {
      const {
        periodStart,
        periodEnd,
        minAmount,
        maxAmount
      } = getSpendListQueryDto;

      let query = await this.entityManager.connection
      .getRepository(UserSpendHistory)
      .createQueryBuilder('userSpendHistory')
      .select([
        'CAST(userSpendHistory.spend_amount AS UNSIGNED) AS spendAmount',
        'userSpendHistory.description AS description',
        'userSpendHistory.spend_date AS spendDate'
      ])
      .innerJoin(
        UserBudgetCategory, 
        'userBudgetCategory', 
        'userBudgetCategory.id = userSpendHistory.user_budget_category_id'
      )
      .innerJoin(
        UserBudget, 
        'userBudget', 
        `userBudget.id = userBudgetCategory.user_budget_id
        AND userBudget.user_id = "${currentUser.id}"`
      )
      .where(`userSpendHistory.spend_date BETWEEN :periodStart AND :periodEnd`, {
        periodStart,
        periodEnd
      })
      .andWhere(`userSpendHistory.spend_amount BETWEEN :minAmount AND :maxAmount`, {
        minAmount,
        maxAmount
      })

      if (!!getSpendListQueryDto.category) {
        const categoryCache = await this.budgetService.getCategory();
        const budgetCategoryId = categoryCache.find(el => el.name === getSpendListQueryDto.category).id;

        query = query.andWhere('userBudgetCategory.budget_category_id = :budgetCategoryId', { budgetCategoryId });
      }

      // TODO: 카테고리 추가, 지출합계 추가

      const list = await query.getRawMany();

      return list;
    } catch (e) {
      throw e;
    }
  }

}