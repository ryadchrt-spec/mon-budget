import { useLiveQuery } from 'dexie-react-hooks'
import { db, genId } from '../db/db'
import type { Category, Transaction, TransactionType, CategoryGoal } from '../types'

export function useCategories(type?: TransactionType) {
  return useLiveQuery(async () => {
    const all = await db.categories.orderBy('order').toArray()
    const visible = all.filter((c) => !c.archived)
    return type ? visible.filter((c) => c.type === type) : visible
  }, [type])
}

export function useAllCategories() {
  return useLiveQuery(() => db.categories.orderBy('order').toArray(), [])
}

export function useMonthTransactions(year: number, month: number) {
  return useLiveQuery(async () => {
    const start = new Date(year, month, 1).getTime()
    const end = new Date(year, month + 1, 1).getTime()
    const all = await db.transactions.toArray()
    return all
      .filter((t) => {
        const time = new Date(t.date).getTime()
        return time >= start && time < end
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [year, month])
}

export function useYearTransactions(year: number) {
  return useLiveQuery(async () => {
    const start = new Date(year, 0, 1).getTime()
    const end = new Date(year + 1, 0, 1).getTime()
    const all = await db.transactions.toArray()
    return all.filter((t) => {
      const time = new Date(t.date).getTime()
      return time >= start && time < end
    })
  }, [year])
}

export function useAllTransactions() {
  return useLiveQuery(() => db.transactions.toArray(), [])
}

export function useCumulativeReserve(year: number, month: number) {
  return useLiveQuery(async () => {
    const end = new Date(year, month + 1, 1).getTime()
    const all = await db.transactions.toArray()
    return all.reduce((sum, t) => {
      if (new Date(t.date).getTime() >= end) return sum
      return sum + (t.type === 'income' ? t.amount : -t.amount)
    }, 0)
  }, [year, month])
}

export function useSettings() {
  return useLiveQuery(() => db.settings.get('app'), [])
}

// Recurring transactions are materialized as real rows (simpler to query/edit than computing
// them on the fly), but we don't generate forever — we keep a rolling horizon of real rows
// ahead of "today" and top it up as time passes, instead of a one-shot batch that ran out.
const RECURRING_HORIZON_MONTHS = 24
const RECURRING_TOPUP_THRESHOLD_MONTHS = 6

type RecurringTemplate = Omit<Transaction, 'id' | 'createdAt'>

async function generateFutureOccurrences(template: RecurringTemplate, fromDate: Date, monthsAhead: number) {
  const now = Date.now()
  const day = fromDate.getDate()
  const records: Transaction[] = []
  for (let i = 1; i <= monthsAhead; i++) {
    const targetYear = fromDate.getFullYear()
    const targetMonth = fromDate.getMonth() + i
    const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
    const clampedDay = Math.min(day, daysInTargetMonth)
    const futureDate = new Date(targetYear, targetMonth, clampedDay, 12).toISOString()
    records.push({ ...template, id: genId(), date: futureDate, createdAt: now + i })
  }
  await db.transactions.bulkAdd(records)
}

export async function addTransaction(input: Omit<Transaction, 'id' | 'createdAt' | 'seriesId'>) {
  const now = Date.now()
  const seriesId = input.recurring ? genId() : undefined
  const record: Transaction = { ...input, id: genId(), createdAt: now, seriesId }
  await db.transactions.add(record)

  if (input.recurring && seriesId) {
    await generateFutureOccurrences({ ...input, seriesId }, new Date(input.date), RECURRING_HORIZON_MONTHS)
  }
}

/**
 * Tops up every active recurring series that's running low on future occurrences, so
 * "se répète chaque mois" keeps working indefinitely instead of stopping after a fixed
 * number of months. Cheap to call on every app load — no-ops when nothing needs topping up.
 */
export async function topUpRecurringSeries() {
  const all = await db.transactions.toArray()
  const bySeries = new Map<string, Transaction[]>()
  for (const t of all) {
    if (!t.recurring || !t.seriesId) continue
    const list = bySeries.get(t.seriesId)
    if (list) list.push(t)
    else bySeries.set(t.seriesId, [t])
  }

  const topUpCutoff = new Date()
  topUpCutoff.setMonth(topUpCutoff.getMonth() + RECURRING_TOPUP_THRESHOLD_MONTHS)

  for (const [seriesId, txns] of bySeries) {
    const latest = txns.reduce((max, t) => (new Date(t.date) > new Date(max.date) ? t : max), txns[0])
    if (new Date(latest.date) < topUpCutoff) {
      const { id: _id, createdAt: _createdAt, ...template } = latest
      await generateFutureOccurrences({ ...template, seriesId }, new Date(latest.date), RECURRING_HORIZON_MONTHS)
    }
  }
}

/**
 * `original` is the transaction as it was before this edit (needed to detect a recurring
 * on/off transition and to know which series/date to act from).
 *
 * - Turning recurring ON: starts a brand-new series from this transaction's date forward.
 * - Turning recurring OFF: stops the series from this transaction's date onward (deletes
 *   the other future occurrences) but leaves past occurrences alone — they already happened.
 * - Recurring unchanged: just updates this one row.
 */
export async function updateTransaction(original: Transaction, changes: Omit<Transaction, 'id' | 'createdAt' | 'seriesId'>) {
  const wasRecurring = !!original.recurring && !!original.seriesId
  const willRecur = changes.recurring

  if (!wasRecurring && willRecur) {
    const seriesId = genId()
    await db.transactions.update(original.id, { ...changes, seriesId })
    await generateFutureOccurrences({ ...changes, seriesId }, new Date(changes.date), RECURRING_HORIZON_MONTHS)
    return
  }

  if (wasRecurring && !willRecur) {
    const seriesId = original.seriesId as string
    const cutoff = new Date(original.date).getTime()
    const seriesRows = await db.transactions.where('seriesId').equals(seriesId).toArray()
    const toDelete = seriesRows.filter((t) => t.id !== original.id && new Date(t.date).getTime() > cutoff)
    if (toDelete.length > 0) {
      await db.transactions.bulkDelete(toDelete.map((t) => t.id))
    }
    await db.transactions.update(original.id, { ...changes, seriesId: undefined })
    return
  }

  await db.transactions.update(original.id, changes)
}

export async function deleteTransaction(id: string) {
  await db.transactions.delete(id)
}

export async function addCategory(input: Omit<Category, 'id' | 'order' | 'isDefault'>) {
  const existing = await db.categories.where('type').equals(input.type).toArray()
  const order = existing.length ? Math.max(...existing.map((c) => c.order)) + 1 : 0
  await db.categories.add({ ...input, id: genId(), order, isDefault: false })
}

export async function updateCategory(id: string, changes: Partial<Category>) {
  await db.categories.update(id, changes)
}

export async function archiveCategory(id: string) {
  await db.categories.update(id, { archived: true })
}

export async function updateSettings(changes: Partial<Omit<import('../types').AppSettings, 'id'>>) {
  await db.settings.update('app', changes)
}

function goalId(year: number, month: number, categoryId: string): string {
  return `${year}-${month}-${categoryId}`
}

export function useCategoryGoals(year: number, month: number) {
  return useLiveQuery(async () => {
    const all = await db.categoryGoals.toArray()
    return all.filter((g) => g.year === year && g.month === month)
  }, [year, month])
}

export function useAllCategoryGoals() {
  return useLiveQuery(() => db.categoryGoals.toArray(), [])
}

export async function setCategoryGoal(
  year: number,
  month: number,
  categoryId: string,
  values: { limit?: number; alertAmount?: number },
) {
  const id = goalId(year, month, categoryId)
  if (!values.limit && !values.alertAmount) {
    await db.categoryGoals.delete(id)
    return
  }
  const record: CategoryGoal = { id, year, month, categoryId, limit: values.limit, alertAmount: values.alertAmount }
  await db.categoryGoals.put(record)
}

export async function clearCategoryGoal(year: number, month: number, categoryId: string) {
  await db.categoryGoals.delete(goalId(year, month, categoryId))
}
