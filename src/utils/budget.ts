import type { Category, Transaction } from '../types'

export interface CategoryBreakdown {
  category: Category
  spent: number
  cap: number | null
  ratio: number
  percentOfIncome: number
  status: 'ok' | 'warning' | 'danger'
}

export function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0)
}

export function topTransactions(transactions: Transaction[], type: 'income' | 'expense', limit = 5): Transaction[] {
  return transactions
    .filter((t) => t.type === type)
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
}

export function categoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  totalIncome: number,
  defaultAlertThreshold: number,
): CategoryBreakdown[] {
  const expenseCategories = categories.filter((c) => c.type === 'expense' && !c.archived)

  return expenseCategories
    .map((category) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0)

      const threshold = category.alertThreshold ?? defaultAlertThreshold
      let cap: number | null = null
      if (category.monthlyLimit && category.monthlyLimit > 0) {
        cap = category.monthlyLimit
      } else if (totalIncome > 0) {
        cap = totalIncome * (threshold / 100)
      }

      const ratio = cap && cap > 0 ? spent / cap : 0
      const percentOfIncome = totalIncome > 0 ? (spent / totalIncome) * 100 : 0

      let status: CategoryBreakdown['status'] = 'ok'
      if (cap !== null) {
        if (ratio >= 1) status = 'danger'
        else if (ratio >= 0.8) status = 'warning'
      }

      return { category, spent, cap, ratio, percentOfIncome, status }
    })
    .filter((row) => row.spent > 0 || row.category.monthlyLimit)
    .sort((a, b) => b.spent - a.spent)
}

export function biggestExpenseCategory(breakdown: CategoryBreakdown[]): CategoryBreakdown | null {
  if (breakdown.length === 0) return null
  return breakdown.reduce((max, row) => (row.spent > max.spent ? row : max), breakdown[0])
}

/**
 * Dépenses prévues pour un mois donné : pour chaque catégorie de dépense,
 * son plafond s'il en a un, sinon la somme de ses paiements récurrents
 * déjà en place à cette date. Sert de référence fixe (le "budget prévu"),
 * indépendante des dépenses réellement enregistrées ce mois-ci.
 *
 * Les paiements récurrents sont regroupés par nom (ex : "Loyer" repris
 * chaque mois) pour ne compter qu'une fois un même engagement reconduit,
 * en gardant son montant le plus récent — deux noms différents dans la
 * même catégorie (ex : "Netflix" et "Spotify") restent additionnés.
 */
export function plannedExpenseTotal(
  year: number,
  month: number,
  categories: Category[],
  allTransactions: Transaction[],
): number {
  const cutoff = new Date(year, month + 1, 1).getTime()
  const expenseCategories = categories.filter((c) => c.type === 'expense' && !c.archived)

  return expenseCategories.reduce((sum, category) => {
    if (category.monthlyLimit && category.monthlyLimit > 0) {
      return sum + category.monthlyLimit
    }

    const latestByLabel = new Map<string, { amount: number; time: number }>()
    for (const t of allTransactions) {
      if (!t.recurring || t.type !== 'expense' || t.categoryId !== category.id) continue
      const time = new Date(t.date).getTime()
      if (time >= cutoff) continue
      const existing = latestByLabel.get(t.label)
      if (!existing || time > existing.time) {
        latestByLabel.set(t.label, { amount: t.amount, time })
      }
    }
    const recurringSum = Array.from(latestByLabel.values()).reduce((s, v) => s + v.amount, 0)
    return sum + recurringSum
  }, 0)
}

export const PIE_FALLBACK_COLORS = [
  '#0369a1', '#16a34a', '#f97316', '#a855f7', '#e11d48',
  '#6366f1', '#ec4899', '#eab308', '#059669', '#78716c',
]
