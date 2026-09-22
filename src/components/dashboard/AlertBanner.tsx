import { AlertTriangle } from 'lucide-react'
import type { CategoryBreakdown } from '../../utils/budget'

export function AlertBanner({ rows }: { rows: CategoryBreakdown[] }) {
  const alerts = rows.filter((r) => r.status === 'danger')
  if (alerts.length === 0) return null

  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-red-200 bg-[var(--color-danger-soft)] p-4"
    >
      {alerts.map((row) => (
        <div key={row.category.id} className="flex items-start gap-3">
          <AlertTriangle size={22} className="mt-0.5 shrink-0 text-[var(--color-danger)]" aria-hidden="true" />
          <p className="text-[15px] font-medium leading-snug text-red-800">
            Le poste <span className="font-bold">{row.category.name}</span> dépasse{' '}
            {row.cap ? `${Math.round(row.ratio * 100)}%` : 'son seuil'} de tes revenus ce mois-ci.
          </p>
        </div>
      ))}
    </div>
  )
}
