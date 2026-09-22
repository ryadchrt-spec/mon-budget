import { Card } from '../ui/Card'
import { formatEUR } from '../../utils/format'

interface MonthBarColumnsProps {
  totalIncome: number
  totalExpense: number
}

export function MonthBarColumns({ totalIncome, totalExpense }: MonthBarColumnsProps) {
  const max = Math.max(totalIncome, totalExpense, 1)
  const incomeHeight = totalIncome > 0 ? Math.max((totalIncome / max) * 100, 6) : 0
  const expenseHeight = totalExpense > 0 ? Math.max((totalExpense / max) * 100, 6) : 0

  return (
    <Card className="flex flex-col p-5">
      <span className="mb-3 text-sm font-medium text-[var(--color-ink-soft)]">Revenus vs Dépenses</span>
      <div className="flex flex-1 items-end justify-center gap-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold tabular-nums text-[var(--color-income)]">{formatEUR(totalIncome, true)}</span>
          <div className="flex h-24 w-12 items-end overflow-hidden rounded-lg bg-[var(--color-surface-muted)]">
            <div
              className="w-full rounded-lg bg-[var(--color-income)] transition-[height] duration-500 ease-out"
              style={{ height: `${incomeHeight}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[var(--color-ink-soft)]">Revenus</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold tabular-nums text-[var(--color-ink)]">{formatEUR(totalExpense, true)}</span>
          <div className="flex h-24 w-12 items-end overflow-hidden rounded-lg bg-[var(--color-surface-muted)]">
            <div
              className="w-full rounded-lg bg-[var(--color-primary)] transition-[height] duration-500 ease-out"
              style={{ height: `${expenseHeight}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[var(--color-ink-soft)]">Dépenses</span>
        </div>
      </div>
    </Card>
  )
}
