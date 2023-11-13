import {
  Inject,
  Injectable
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EntityManager, Repository } from 'typeorm';
import { BadRequestValueException, ServerErrorException } from '@/loader/exception/error.service';
import { SetBudgetDto } from './dto/setBudget.dto';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBudget } from '@/model/entities/UserBudget';
import { User } from '@/model/entities/User';
import { BudgetCategory } from '@/model/entities/BudgetCategory';
import { UserExpandHistory } from '@/model/entities/UserExpandHistory';

@Injectable()
export class BudgetService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly entityManager: EntityManager,
    @InjectRepository(UserBudget)
    private userBudgetRepository: Repository<UserBudget>,
    
  ) {}

  // 예산 설정
  async setBudget(currentUser, setBudgetDto: SetBudgetDto): Promise<object> {
    try {
      const {
        budgetCategoryId,
        budget,
        periodStart
      } = setBudgetDto;

      const today = dayjs().format('YYYY-MM-DD');
      const validPeriodStart = dayjs(periodStart).isSameOrAfter(today);

      if (!validPeriodStart) {
        throw BadRequestValueException(`시작 날짜가 유효하지 않습니다\n다시 입력해주세요`);
      }

      const periodEnd = dayjs(periodStart).add(1, 'M').format('YYYY-MM-DD');

      // TODO: 카테고리 - 기간 중복 확인 !!

      const inserted = await this.entityManager.connection.query(`
      SELECT insert_user_budget(?, ?, ?, ?, ?) AS _id
      `, [
        budgetCategoryId,
        currentUser.id,
        budget,
        periodStart,
        periodEnd
      ])

      return { message: `예산이 설정되었습니다` }
    } catch (err) {
      throw ServerErrorException(err.message);
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

      // insert budget, expand history
      for (let ct of randomCt) {
        const budget = (Math.floor(Math.random() * 100)).toString().padEnd(6, '0');
        
        const inserted = await this.entityManager.connection.query(`
        SELECT insert_user_budget(?, ?, ?, ?, ?) AS _id
        `, [
          ct,
          user.id,
          budget,
          periodStart,
          periodEnd
        ])

        // 랜덤 지출 ..
        const num = new Array(Math.floor(Math.random() * 4) + 1).fill({})
        const value = num.map(() => {
          return {
            id: '',
            userBudgetId: inserted[0]._id,
            expandAmount: (Math.floor(Math.random() * 100)).toString().padEnd(5, '0'),
            expandDate: dayjs(today).add(Math.floor(Math.random() * 10), 'd').format('YYYY-MM-DD')
          }
        })

        await this.entityManager.connection
        .createQueryBuilder()
        .insert()
        .into(UserExpandHistory)
        .values(value)
        .execute()

      }

    }
  }
}