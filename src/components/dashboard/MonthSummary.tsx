import { Flame } from 'lucide-react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { MonthBarColumns } from './MonthBarColumns'
import { ReserveCard } from './ReserveCard'
import { formatEUR } from '../../utils/format'
import type { CategoryBreakdown } from '../../utils/budget'

interface MonthSummaryProps {
  totalIncome: number
  totalExpense: number
  reserve: number
  biggest: CategoryBreakdown | null
}

export function MonthSummary({ totalIncome, totalExpense, reserve, biggest }: MonthSummaryProps) {
  const balance = totalIncome - totalExpense
  const positive = balance >= 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="col-span-1 flex flex-col justify-between p-5 sm:col-span-1">
        <span className="text-sm font-medium text-[var(--color-ink-soft)]">Solde du mois</span>
        <span
          className={`font-heading mt-1 text-4xl font-bold tabular-nums ${
            positive ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
          }`}
        >
          {positive ? '+ ' : '− '}
          {formatEUR(Math.abs(balance))}
        </span>
        <span className="mt-1 text-sm text-[var(--color-ink-soft)]">
          {positive ? "Bravo, tu es dans le vert !" : 'Tu dépenses plus que tu ne gagnes.'}
        </span>
      </Card>

      <MonthBarColumns totalIncome={totalIncome} totalExpense={totalExpense} />

      <ReserveCard reserve={reserve} monthDelta={balance} />

      {biggest && (
        <Card className="col-span-1 flex items-center gap-4 p-5 sm:col-span-3">
          <IconBadge icon={biggest.category.icon} color={biggest.category.color} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)]">
              <Flame size={15} className="text-[var(--color-warning)]" aria-hidden="true" />
              Ton plus gros poste ce mois-ci
            </div>
            <div className="font-heading truncate text-xl font-bold text-[var(--color-ink)]">
              {biggest.category.name}
            </div>
          </div>
          <span className="font-heading shrink-0 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
            {formatEUR(biggest.spent)}
          </span>
        </Card>
      )}
    </div>
  )
}
