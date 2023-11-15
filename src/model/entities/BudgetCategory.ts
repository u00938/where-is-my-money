import { Column, Entity } from "typeorm";

@Entity("budget_category", { schema: "wmm" })
export class BudgetCategory {
  @Column("varchar", { primary: true, name: "id", length: 12 })
  id: string;

  @Column("varchar", { name: "name", length: 20 })
  name: string;
}
