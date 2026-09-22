import { Gauge } from 'lucide-react'
import { Card } from '../ui/Card'
import { CategoryProgressBar } from '../ui/ProgressBar'
import type { CategoryBreakdown } from '../../utils/budget'

export function CategoryProgressList({ rows }: { rows: CategoryBreakdown[] }) {
  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center gap-2">
        <Gauge size={18} className="text-[var(--color-primary)]" aria-hidden="true" />
        <h3 className="font-heading text-lg font-semibold text-[var(--color-ink)]">Suivi par catégorie</h3>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-[15px] text-[var(--color-ink-soft)]">
          Aucune dépense enregistrée ce mois-ci.
        </p>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {rows.map((row) => (
            <CategoryProgressBar key={row.category.id} row={row} />
          ))}
        </div>
      )}
    </Card>
  )
}
