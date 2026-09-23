import { AlertTriangle } from 'lucide-react'
import { formatEUR } from '../../utils/format'
import type { CategoryBreakdown } from '../../utils/budget'

export function AlertBanner({ rows }: { rows: CategoryBreakdown[] }) {
  const alerts = rows.filter((r) => r.status === 'danger')
  if (alerts.length === 0) return null

  return (
    <div
      data-anim-card
      role="alert"
      className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-red-200 bg-[var(--color-danger-soft)] p-4"
    >
      {alerts.map((row) => (
        <div key={row.category.id} className="flex items-center gap-3">
          <AlertTriangle size={22} className="shrink-0 text-[var(--color-danger)]" aria-hidden="true" />
          <p className="text-[15px] font-medium leading-snug text-red-800">
            Le poste <span className="font-bold">{row.category.name}</span>{' '}
            {row.isCustomLimit ? (
              <>
                dépasse son plafond de <span className="font-bold">{formatEUR(row.spent - (row.cap ?? 0))}</span>{' '}
                (plafond fixé à {formatEUR(row.cap ?? 0)}).
              </>
            ) : (
              <>
                dépasse <span className="font-bold">{Math.round(row.percentOfIncome)}%</span> de tes revenus ce
                mois-ci.
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  )
}
