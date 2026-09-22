import { PiggyBank } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatEUR } from '../../utils/format'

export function ReserveCard({ reserve }: { reserve: number }) {
  const positive = reserve >= 0

  return (
    <Card className="flex flex-col justify-between p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)]">
        <PiggyBank size={16} className="text-[var(--color-primary)]" aria-hidden="true" />
        Argent de côté total
      </div>
      <span
        className={`font-heading mt-1 text-3xl font-bold tabular-nums ${
          positive ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
        }`}
      >
        {positive ? '+ ' : '− '}
        {formatEUR(Math.abs(reserve))}
      </span>
      <span className="mt-1 text-sm text-[var(--color-ink-soft)]">
        {positive ? 'Ce qui te reste au total.' : 'Tu as tapé dans ta réserve.'}
      </span>
    </Card>
  )
}
