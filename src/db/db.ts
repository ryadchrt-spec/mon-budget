import Dexie, { type Table } from 'dexie'
import type { Category, Transaction, AppSettings, CategoryGoal } from '../types'
import { DEFAULT_CATEGORIES } from '../data/defaultCategories'

export class BudgetDB extends Dexie {
  categories!: Table<Category, string>
  transactions!: Table<Transaction, string>
  settings!: Table<AppSettings, string>
  categoryGoals!: Table<CategoryGoal, string>

  constructor() {
    super('mon-budget-db')
    this.version(1).stores({
      categories: 'id, type, order',
      transactions: 'id, categoryId, type, date',
      settings: 'id',
    })
    this.version(2).stores({
      categories: 'id, type, order',
      transactions: 'id, categoryId, type, date, seriesId',
      settings: 'id',
      categoryGoals: 'id, year, month, categoryId',
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

/**
 * Category goals used to be a single global "plafond" stored on the category itself.
 * Now goals are per (year, month). Runs once: turns each category's old global limit
 * into a goal for the current month, so nobody's existing budget silently disappears.
 * Guarded by categoryGoals being empty so it never overwrites goals set after migration.
 */
export async function migrateCategoryLimitsToGoals() {
  const alreadyMigrated = (await db.categoryGoals.count()) > 0
  if (alreadyMigrated) return

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const categories = await db.categories.toArray()
  const toAdd: CategoryGoal[] = categories
    .filter((c) => c.monthlyLimit && c.monthlyLimit > 0)
    .map((c) => ({
      id: `${year}-${month}-${c.id}`,
      year,
      month,
      categoryId: c.id,
      limit: c.monthlyLimit as number,
    }))

  if (toAdd.length > 0) {
    await db.categoryGoals.bulkAdd(toAdd)
  }
}

/**
 * Recurring transactions created before series tracking existed have `recurring: true`
 * but no `seriesId`, so the new top-up logic can't find and extend them — they'd keep
 * stopping after their original batch, as before. Runs once: groups those old rows by
 * (category, type, label) — the same identity `plannedExpenseTotal` already uses to treat
 * repeats of "Loyer" as one commitment — and gives each group a shared seriesId. Purely
 * additive (only sets a field on existing rows), so nothing is deleted or renamed.
 */
export async function migrateLegacyRecurringSeries() {
  const all = await db.transactions.toArray()
  const legacyRecurring = all.filter((t) => t.recurring && !t.seriesId)
  if (legacyRecurring.length === 0) return

  const groups = new Map<string, Transaction[]>()
  for (const t of legacyRecurring) {
    const key = `${t.categoryId}|${t.type}|${t.label}`
    const list = groups.get(key)
    if (list) list.push(t)
    else groups.set(key, [t])
  }

  for (const txns of groups.values()) {
    const seriesId = genId()
    await db.transactions.bulkPut(txns.map((t) => ({ ...t, seriesId })))
  }
}

export function genId(): string {
  return crypto.randomUUID()
}
