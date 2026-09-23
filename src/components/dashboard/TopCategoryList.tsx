import { Crown } from 'lucide-react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { formatEUR } from '../../utils/format'
import type { CategoryBreakdown } from '../../utils/budget'

const minusEUR = (n: number) => `− ${formatEUR(n)}`

export function TopCategoryList({ rows, limit = 5 }: { rows: CategoryBreakdown[]; limit?: number }) {
  const top = rows.slice(0, limit)

  return (
    <Card data-anim-card className="p-5">
      <div className="mb-1 flex items-center gap-2">
        <Crown size={18} className="text-[var(--color-warning)]" aria-hidden="true" />
        <h3 className="font-heading text-lg font-semibold text-[var(--color-ink)]">Top des dépenses par catégorie</h3>
      </div>
      {top.length === 0 ? (
        <p className="py-6 text-center text-[15px] text-[var(--color-ink-soft)]">Aucune dépense ce mois-ci.</p>
      ) : (
        <div className="flex flex-col">
          {top.map((row, i) => (
            <div key={row.category.id} className="flex items-center gap-3 rounded-2xl px-2 py-2.5">
              <span className="w-5 shrink-0 text-center text-sm font-bold text-[var(--color-ink-soft)]">{i + 1}</span>
              <IconBadge icon={row.category.icon} color={row.category.color} size="sm" />
              <span className="flex-1 truncate text-[15px] font-medium text-[var(--color-ink)]">{row.category.name}</span>
              <AnimatedNumber
                value={row.spent}
                formatter={minusEUR}
                className="shrink-0 text-[15px] font-bold tabular-nums text-[var(--color-danger)]"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
