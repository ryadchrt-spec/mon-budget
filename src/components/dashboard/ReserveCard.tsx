import { PiggyBank } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatEUR } from '../../utils/format'

interface ReserveCardProps {
  reserve: number
  monthDelta: number
}

export function ReserveCard({ reserve, monthDelta }: ReserveCardProps) {
  const positive = reserve >= 0
  const deltaPositive = monthDelta >= 0

  return (
    <Card className="flex flex-col justify-between p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)]">
        <PiggyBank size={16} className="text-[var(--color-primary)]" aria-hidden="true" />
        Argent de côté
      </div>
      <span
        className={`font-heading mt-1 text-2xl font-bold tabular-nums ${
          positive ? 'text-[var(--color-ink)]' : 'text-[var(--color-danger)]'
        }`}
      >
        {formatEUR(reserve)}
      </span>
      <span className={`mt-1 text-sm font-semibold ${deltaPositive ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'}`}>
        {deltaPositive ? '+ ' : '− '}
        {formatEUR(Math.abs(monthDelta))} ce mois-ci
      </span>
    </Card>
  )
}
