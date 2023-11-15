import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UserBudgetCategory } from "./UserBudgetCategory";

@Index("user_budget_category_id", ["userBudgetCategoryId"], {})
@Entity("user_expand_history", { schema: "wmm" })
export class UserExpandHistory {
  @Column("varchar", { primary: true, name: "id", length: 30 })
  id: string;

  @Column("varchar", { name: "user_budget_category_id", length: 30 })
  userBudgetCategoryId: string;

  @Column("decimal", {
    name: "expand_amount",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  expandAmount: string | null;

  @Column("date", { name: "expand_date" })
  expandDate: string;

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
    (userBudgetCategory) => userBudgetCategory.userExpandHistories,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "user_budget_category_id", referencedColumnName: "id" }])
  userBudgetCategory: UserBudgetCategory;
}
