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
      <div className="flex min-h-80 flex-1 items-end justify-center gap-14 py-2">
        <div className="flex h-full flex-col items-center gap-2.5">
          <span className="text-base font-bold tabular-nums text-[var(--color-income)]">
            + {formatEUR(totalIncome, true)}
          </span>
          <div className="flex w-20 flex-1 items-end overflow-hidden rounded-xl bg-[var(--color-surface-muted)]">
            <div
              className="w-full rounded-xl bg-[var(--color-income)] transition-[height] duration-500 ease-out"
              style={{ height: `${incomeHeight}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[var(--color-ink-soft)]">Revenus</span>
        </div>
        <div className="flex h-full flex-col items-center gap-2.5">
          <span className="text-base font-bold tabular-nums text-[var(--color-danger)]">
            − {formatEUR(totalExpense, true)}
          </span>
          <div className="flex w-20 flex-1 items-end overflow-hidden rounded-xl bg-[var(--color-surface-muted)]">
            <div
              className="w-full rounded-xl bg-[var(--color-danger)] transition-[height] duration-500 ease-out"
              style={{ height: `${expenseHeight}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[var(--color-ink-soft)]">Dépenses</span>
        </div>
      </div>
    </Card>
  )
}
