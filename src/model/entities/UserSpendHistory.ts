import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UserBudgetCategory } from "./UserBudgetCategory";

@Index("user_budget_category_id", ["userBudgetCategoryId"], {})
@Entity("user_spend_history", { schema: "wmm" })
export class UserSpendHistory {
  @Column("varchar", { primary: true, name: "id", length: 30 })
  id: string;

  @Column("varchar", { name: "user_budget_category_id", length: 30 })
  userBudgetCategoryId: string;

  @Column("decimal", {
    name: "spend_amount",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  spendAmount: string | null;

  @Column("varchar", {
    name: "description",
    length: 50,
    default: () => '""'
  })
  description: string;

  @Column("date", { name: "spend_date" })
  spendDate: string;

  @Column("tinyint", { name: "is_sum", nullable: true, default: () => "'1'" })
  isSum: number | null;

  @Column("datetime", {
    name: "created_dt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDt: Date | null;

  @Column("datetime", {
    name: "updated_dt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedDt: Date | null;

  @ManyToOne(
    () => UserBudgetCategory,
    (userBudgetCategory) => userBudgetCategory.userSpendHistories,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "user_budget_category_id", referencedColumnName: "id" }])
  userBudgetCategory: UserBudgetCategory;
}
