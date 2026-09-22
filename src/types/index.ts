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
}

export interface AppSettings {
  id: 'app'
  defaultAlertThreshold: number
  theme: 'light' | 'dark' | 'auto'
}
