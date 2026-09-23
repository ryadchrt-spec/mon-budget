import { Flame } from 'lucide-react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { MonthDeltaCard } from './MonthDeltaCard'
import { ReserveCard } from './ReserveCard'
import { formatEUR } from '../../utils/format'
import type { CategoryBreakdown } from '../../utils/budget'

interface MonthSummaryProps {
  totalIncome: number
  totalExpense: number
  reserve: number
  biggest: CategoryBreakdown | null
}

const signedEUR = (n: number) => `${n >= 0 ? '+ ' : '− '}${formatEUR(Math.abs(n))}`
const negativeEUR = (n: number) => `− ${formatEUR(Math.abs(n))}`

export function MonthSummary({ totalIncome, totalExpense, reserve, biggest }: MonthSummaryProps) {
  const balance = totalIncome - totalExpense
  const positive = balance >= 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card data-anim-card className="col-span-1 flex flex-col justify-between p-5 sm:col-span-1">
        <span className="text-sm font-medium text-[var(--color-ink-soft)]">Solde du mois</span>
        <AnimatedNumber
          value={balance}
          formatter={signedEUR}
          className={`font-heading mt-1 text-4xl font-bold tabular-nums ${
            positive ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
          }`}
        />
        <span className="mt-1 text-sm text-[var(--color-ink-soft)]">
          {positive ? "Bravo, tu es dans le vert !" : 'Tu dépenses plus que tu ne gagnes.'}
        </span>
      </Card>

      <MonthDeltaCard delta={balance} />

      <ReserveCard reserve={reserve} />

      {biggest && (
        <Card data-anim-card className="col-span-1 flex items-center gap-4 p-5 sm:col-span-3">
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
          <AnimatedNumber
            value={biggest.spent}
            formatter={negativeEUR}
            className="font-heading shrink-0 text-2xl font-bold tabular-nums text-[var(--color-danger)]"
          />
        </Card>
      )}
    </div>
  )
}
