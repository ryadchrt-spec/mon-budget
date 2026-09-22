import Dexie, { type Table } from 'dexie'
import type { Category, Transaction, AppSettings } from '../types'
import { DEFAULT_CATEGORIES } from '../data/defaultCategories'

export class BudgetDB extends Dexie {
  categories!: Table<Category, string>
  transactions!: Table<Transaction, string>
  settings!: Table<AppSettings, string>

  constructor() {
    super('mon-budget-db')
    this.version(1).stores({
      categories: 'id, type, order',
      transactions: 'id, categoryId, type, date',
      settings: 'id',
    })
  }
}

export const db = new BudgetDB()

export async function ensureSeedData() {
  await db.transaction('rw', db.categories, db.settings, async () => {
    const count = await db.categories.count()
    if (count === 0) {
      await db.categories.bulkPut(DEFAULT_CATEGORIES)
    }
    const settings = await db.settings.get('app')
    if (!settings) {
      await db.settings.put({ id: 'app', defaultAlertThreshold: 50, theme: 'light' })
    }
  })
}

export function genId(): string {
  return crypto.randomUUID()
}
