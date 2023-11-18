import { Inject, Injectable } from "@nestjs/common";
import { Cron } from '@nestjs/schedule';
import { HttpService } from "@nestjs/axios";
import payloads from "./webhook.payloads";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { EntityManager } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Logger } from "winston";
import { UserDiscordService } from "@/model/entities/UserDiscordService";
import { UserBudget } from "@/model/entities/UserBudget";
import { UserBudgetCategory } from "@/model/entities/UserBudgetCategory";
import { BudgetCategory } from "@/model/entities/BudgetCategory";
import calculator from "@/util/calculator";
import Big from "big.js";
import keyword from "@/util/keyword";
import { UserSpendHistory } from "@/model/entities/UserSpendHistory";

@Injectable()
export class WebhookService {
  constructor(
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  // 오늘 지출 추천 consulting_guide
  @Cron('*/5 * * * * *') // 테스트용
  // @Cron('0 30 8 * * *') // 오전 8시 30분
  async consultingGuideDiscord() {
    this.logger.info(`start today's spending recommendation service - discord`)

    // 지출 추천 서비스 이용 유저 대상자 조회
    const serviceId = 'consulting_guide';

    const userList = await this.entityManager.connection
    .getRepository(UserDiscordService)
    .createQueryBuilder('userDiscordService')
    .select([
      'UserDiscordService.user_id AS userId',
      'UserDiscordService.discord_url AS discordUrl',
      'userBudget.id AS userBudgetId',
      'userBudget.budget AS budget',
      'userBudget.acc_spend AS accSpend',
      'userBudget.period_start AS periodStart',
      'userBudget.period_end AS periodEnd',
      'DATEDIFF(userBudget.period_end, NOW()) + 1 AS leftDays'
    ])
    .innerJoin(UserBudget, 'userBudget', 'userBudget.user_id = userDiscordService.user_id')
    .where(`NOW() BETWEEN userBudget.period_start AND userBudget.period_end`)
    .andWhere('userDiscordService.service_id = :serviceId', { serviceId })
    .getRawMany();

    this.logger.info(`discord consulting guide service user: ${JSON.stringify(userList)}`);

    if (userList[0]) {
      for (let user of userList) {
        const leftAmount = new Big(user.budget).minus(new Big(user.accSpend));
        // 오늘 지출 가능 금액
        const dailyMaxSpend = calculator.dailyMaxSpendAmount(
          user.budget,
          user.leftDays,
          user.accSpend
        );

        const spendingRate = calculator.spendingRate(
          user.budget,
          user.periodStart,
          user.periodEnd,
          user.accSpend
        );
      
        let categoryBudget = await this.entityManager.connection
        .getRepository(UserBudgetCategory)
        .createQueryBuilder('userBudgetCategory')
        .select([
          'budgetCategory.name AS budgetCategoryName',
          'userBudgetCategory.budget AS budget',
          'userBudgetCategory.acc_spend AS accSpend'
        ])
        .innerJoin(BudgetCategory, 'budgetCategory', 'budgetCategory.id = userBudgetCategory.budgetCategoryId')
        .where('userBudgetCategory.user_budget_id = :userBudgetId', { userBudgetId: user.userBudgetId })
        .getRawMany();

        categoryBudget = categoryBudget.reduce((acc, cur) => {
          const dailyCategoryMaxSpend = calculator.dailyMaxSpendAmount(
            cur.budget,
            user.leftDays,
            cur.accSpend
          )
          
          return acc += `${cur.budgetCategoryName} - ${dailyCategoryMaxSpend}원 \n`;
        }, '')

        const msgFormat = payloads[`${serviceId}_msgFormat`](
          leftAmount, 
          dailyMaxSpend, 
          categoryBudget, 
          keyword.consulting_guide(spendingRate)
        );

        // send message
        const message = payloads[serviceId](msgFormat, user.leftDays);

        await this.httpService
          .post(user.discordUrl, message)
          .subscribe({
            complete: () => {
              console.log('completed');
            },
            error: (err) => {
              console.log(err);
            }
          });     
      }
    }

    this.logger.info(`end today's spending recommendation service - discord`)

  }

  // 오늘 지출 안내 consulting_notify    
  // @Cron('*/5 * * * * *') // 테스트용
  @Cron('0 30 22 * * *') // 오후 10시 30분
  async consultingNotifyDiscord() {
    this.logger.info(`start today's spending notify service - discord`)

    // 지출 안내 서비스 이용 유저 대상자 조회
    const serviceId = 'consulting_notify';

    const userList = await this.entityManager.connection
    .getRepository(UserDiscordService)
    .createQueryBuilder('userDiscordService')
    .select([
      'UserDiscordService.user_id AS userId',
      'UserDiscordService.discord_url AS discordUrl',
      'userBudget.id AS userBudgetId',
      'userBudget.budget AS budget',
      'userBudget.acc_spend AS accSpend',
      'userBudget.period_start AS periodStart',
      'userBudget.period_end AS periodEnd',
      'DATEDIFF(userBudget.period_end, NOW()) + 1 AS leftDays'
    ])
    .innerJoin(UserBudget, 'userBudget', 'userBudget.user_id = userDiscordService.user_id')
    .where(`NOW() BETWEEN userBudget.period_start AND userBudget.period_end`)
    .andWhere('userDiscordService.service_id = :serviceId', { serviceId })
    .getRawMany();

    if (userList[0]) {
      for (let user of userList) {
        const leftAmount = new Big(user.budget).minus(new Big(user.accSpend));
        // 오늘 지출 가능 금액
        const dailyMaxSpend = calculator.dailyMaxSpendAmount(
          user.budget,
          user.leftDays,
          user.accSpend
        );

        const spendingRate = calculator.spendingRate(
          user.budget,
          user.periodStart,
          user.periodEnd,
          user.accSpend
        );

        let spendHistory = await this.entityManager.connection
        .getRepository(UserSpendHistory)
        .createQueryBuilder('userSpendHistory')
        .select([
          'COALESCE(SUM(userSpendHistory.spend_amount), 0) AS spendAmount',
          'budgetCategory.name AS budgetCategoryName',
          'userBudgetCategory.budget AS budget'
        ])
        .innerJoin(UserBudgetCategory, 'userBudgetCategory', 'userBudgetCategory.id = userSpendHistory.user_budget_category_id')
        .innerJoin(BudgetCategory, 'budgetCategory', 'budgetCategory.id = userBudgetCategory.budgetCategoryId')
        .where('userBudgetCategory.user_budget_id = :userBudgetId', { userBudgetId: user.userBudgetId })
        .andWhere('userSpendHistory.spend_date = DATE(NOW())')
        .groupBy('userSpendHistory.user_budget_category_id')
        .getRawMany();

        let spendToday = new Big(0);

        spendHistory = spendHistory[0] ? spendHistory.reduce((acc, cur) => {
          spendToday = spendToday.plus(cur.spendAmount);
          const dailyCategoryMaxSpend = calculator.dailyMaxSpendAmount(
            cur.budget,
            user.leftDays,
            cur.spendAmount
          )

          const spendingRate = calculator.spendingRate(
            cur.budget,
            user.periodStart,
            user.periodEnd,
            cur.spendAmount
          )
          
          return acc += `
          ${cur.budgetCategoryName} - 오늘 하루 권장 금액 ${dailyCategoryMaxSpend}원 중에 ${parseInt(cur.spendAmount)}원 쓰셨어요! \n 
          현재까지 예산 **${spendingRate}%** 소비 중 \n
          `;
        }, '') : `오늘은 지출이 없어요😉`;

        spendToday = spendToday.toFixed().toString();

        const msgFormat = payloads[`${serviceId}_msgFormat`](
          leftAmount, 
          dailyMaxSpend, 
          spendToday, 
          spendingRate,
          spendHistory
        );

        // send message
        const message = payloads[serviceId](msgFormat, spendToday, user.leftDays);

        await this.httpService
          .post(user.discordUrl, message)
          .subscribe({
            complete: () => {
              console.log('completed');
            },
            error: (err) => {
              console.log(err);
            }
          }); 

      }
    }
    
    this.logger.info(`end today's spending notify service - discord`)

  }
}