import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { UserBudget } from "./UserBudget";
import { UserSpendHistory } from "./UserSpendHistory";

@Index("user_budget_id", ["userBudgetId"], {})
@Entity("user_budget_category", { schema: "wmm" })
export class UserBudgetCategory {
  @Column("varchar", { primary: true, name: "id", length: 30 })
  id: string;

  @Column("varchar", { name: "user_budget_id", length: 30 })
  userBudgetId: string;

  @Column("varchar", { name: "budget_category_id", length: 12 })
  budgetCategoryId: string;

  @Column("decimal", {
    name: "budget",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  budget: string | null;

  @Column("decimal", {
    name: "budget_per",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  budgetPer: string | null;

  @Column("decimal", {
    name: "acc_spend",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  accSpend: string | null;

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

  @ManyToOne(
    () => UserBudget,
    (userBudget) => userBudget.userBudgetCategories,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "user_budget_id", referencedColumnName: "id" }])
  userBudget: UserBudget;

  @OneToMany(
    () => UserSpendHistory,
    (userSpendHistory) => userSpendHistory.userBudgetCategory
  )
  userSpendHistories: UserSpendHistory[];
}
