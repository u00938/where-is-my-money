import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { BudgetCategory } from "./BudgetCategory";
import { UserExpandHistory } from "./UserExpandHistory";

@Index("user_id", ["userId"], {})
@Index("budget_category_id", ["budgetCategoryId"], {})
@Entity("user_budget", { schema: "wmm" })
export class UserBudget {
  @Column("varchar", { primary: true, name: "id", length: 30 })
  id: string;

  @Column("varchar", { name: "budget_category_id", length: 12 })
  budgetCategoryId: string;

  @Column("varchar", { name: "user_id", length: 30 })
  userId: string;

  @Column("decimal", {
    name: "budget",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  budget: string | null;

  @Column("decimal", {
    name: "current_expand",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  currentExpand: string | null;

  @Column("date", { name: "period_start" })
  periodStart: Date;

  @Column("date", { name: "period_end" })
  periodEnd: Date;

  @Column("datetime", {
    name: "created_dt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDt: Date;

  @Column("datetime", {
    name: "updated_dt",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedDt: Date;

  @ManyToOne(() => User, (user) => user.userBudgets, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(
    () => BudgetCategory,
    (budgetCategory) => budgetCategory.userBudgets,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "budget_category_id", referencedColumnName: "id" }])
  budgetCategory: BudgetCategory;

  @OneToMany(
    () => UserExpandHistory,
    (userExpandHistory) => userExpandHistory.userBudget
  )
  userExpandHistories: UserExpandHistory[];
}
