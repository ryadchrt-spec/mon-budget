import { PiggyBank } from 'lucide-react'
import { Card } from '../ui/Card'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { formatEUR } from '../../utils/format'

const signedEUR = (n: number) => `${n >= 0 ? '+ ' : '− '}${formatEUR(Math.abs(n))}`

export function ReserveCard({ reserve }: { reserve: number }) {
  const positive = reserve >= 0

  return (
    <Card data-anim-card className="flex flex-col justify-between p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)]">
        <PiggyBank size={16} className="text-[var(--color-primary)]" aria-hidden="true" />
        Argent de côté total
      </div>
      <AnimatedNumber
        value={reserve}
        formatter={signedEUR}
        className={`font-heading mt-1 text-3xl font-bold tabular-nums ${
          positive ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
        }`}
      />
      <span className="mt-1 text-sm text-[var(--color-ink-soft)]">
        {positive ? 'Ce qui te reste au total.' : 'Tu as tapé dans ta réserve.'}
      </span>
    </Card>
  )
}
