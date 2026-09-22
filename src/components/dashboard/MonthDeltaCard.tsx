import { Wallet } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatEUR } from '../../utils/format'

export function MonthDeltaCard({ delta }: { delta: number }) {
  const positive = delta >= 0

  return (
    <Card className="flex flex-col justify-between p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)]">
        <Wallet size={16} className="text-[var(--color-primary)]" aria-hidden="true" />
        Argent mis de côté ce mois-ci
      </div>
      <span
        className={`font-heading mt-1 text-3xl font-bold tabular-nums ${
          positive ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
        }`}
      >
        {positive ? '+ ' : '− '}
        {formatEUR(Math.abs(delta))}
      </span>
      <span className="mt-1 text-sm text-[var(--color-ink-soft)]">
        {positive ? 'Tu as mis de l’argent de côté.' : 'Tu as dépensé plus que tes revenus.'}
      </span>
    </Card>
  )
}
