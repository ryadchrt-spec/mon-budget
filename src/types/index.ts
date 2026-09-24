export type TransactionType = 'expense' | 'income'

export interface Category {
  id: string
  type: TransactionType
  name: string
  icon: string
  color: string
  monthlyLimit?: number
  alertThreshold?: number
  isDefault: boolean
  archived?: boolean
  order: number
}

export interface Transaction {
  id: string
  type: TransactionType
  categoryId: string
  label: string
  amount: number
  date: string
  createdAt: number
  recurring?: boolean
  /** Links every occurrence of the same recurring payment together. Only set when `recurring` is true. */
  seriesId?: string
}

export interface AppSettings {
  id: 'app'
  defaultAlertThreshold: number
  theme: 'light' | 'dark' | 'auto'
}

/** A category's spending goal for one specific (year, month) — goals don't carry over automatically. */
export interface CategoryGoal {
  id: string
  year: number
  month: number
  categoryId: string
  limit: number
}
