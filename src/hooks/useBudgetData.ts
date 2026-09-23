import { useLiveQuery } from 'dexie-react-hooks'
import { db, genId } from '../db/db'
import type { Category, Transaction, TransactionType } from '../types'

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

const RECURRING_MONTHS_AHEAD = 11

export async function addTransaction(input: Omit<Transaction, 'id' | 'createdAt'>) {
  const now = Date.now()
  await db.transactions.add({ ...input, id: genId(), createdAt: now })

  if (input.recurring) {
    const original = new Date(input.date)
    const day = original.getDate()
    const futureRecords: Transaction[] = []
    for (let i = 1; i <= RECURRING_MONTHS_AHEAD; i++) {
      const targetYear = original.getFullYear()
      const targetMonth = original.getMonth() + i
      const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
      const clampedDay = Math.min(day, daysInTargetMonth)
      const futureDate = new Date(targetYear, targetMonth, clampedDay, 12).toISOString()
      futureRecords.push({ ...input, id: genId(), date: futureDate, createdAt: now + i })
    }
    await db.transactions.bulkAdd(futureRecords)
  }
}

export async function updateTransaction(id: string, changes: Partial<Transaction>) {
  await db.transactions.update(id, changes)
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
