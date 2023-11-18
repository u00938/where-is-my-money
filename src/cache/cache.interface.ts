export interface budgetStt {
  per: Array<string>,
  date: string
}

export interface category {
  id: string,
  name: string
}

export interface spendStt {
  totalPer: string,
  categoryPer: object,
  date: string
}