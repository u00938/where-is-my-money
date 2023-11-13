import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { UserBudgetCategory } from "./UserBudgetCategory";

@Index("user_id", ["userId"], {})
@Entity("user_budget", { schema: "wmm" })
export class UserBudget {
  @Column("varchar", { primary: true, name: "id", length: 30 })
  id: string;

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
  periodStart: string;

  @Column("date", { name: "period_end" })
  periodEnd: string;

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

  @OneToMany(
    () => UserBudgetCategory,
    (userBudgetCategory) => userBudgetCategory.userBudget
  )
  userBudgetCategories: UserBudgetCategory[];
}
