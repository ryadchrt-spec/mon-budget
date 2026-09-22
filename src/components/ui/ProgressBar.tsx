import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { CategoryBreakdown } from '../../utils/budget'
import { formatEUR } from '../../utils/format'

const TEXT_STYLES: Record<CategoryBreakdown['status'], string> = {
  ok: 'text-[var(--color-ink-soft)]',
  warning: 'text-[var(--color-warning)]',
  danger: 'text-[var(--color-danger)]',
}

// 5 étapes cohérentes du vert au rouge, au fil du remplissage de la barre.
const GRADIENT_STOPS = [
  { upTo: 0.2, color: '#16a34a' }, // vert
  { upTo: 0.4, color: '#65a30d' }, // vert-olive
  { upTo: 0.6, color: '#eab308' }, // jaune ambré
  { upTo: 0.8, color: '#f97316' }, // orange
  { upTo: Infinity, color: '#dc2626' }, // rouge
]

function gradientColor(ratio: number): string {
  return (GRADIENT_STOPS.find((stop) => ratio < stop.upTo) ?? GRADIENT_STOPS[GRADIENT_STOPS.length - 1]).color
}

export function CategoryProgressBar({ row }: { row: CategoryBreakdown }) {
  const textStyle = TEXT_STYLES[row.status]
  const pct = row.cap ? Math.min(100, Math.round(row.ratio * 100)) : 0
  const barColor = gradientColor(row.ratio)

  return (
    <div className="py-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="truncate text-[15px] font-medium text-[var(--color-ink)]">{row.category.name}</span>
        <span className={`flex items-center gap-1 text-sm font-semibold ${textStyle}`}>
          {row.status === 'danger' && <AlertTriangle size={15} aria-hidden="true" />}
          {row.status === 'ok' && row.cap && <CheckCircle2 size={14} className="text-[var(--color-income)]" aria-hidden="true" />}
          − {formatEUR(row.spent)}
          {row.cap ? <span className="font-normal text-[var(--color-ink-soft)]"> / {formatEUR(row.cap)}</span> : null}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
        <div
          className="h-full rounded-full transition-[width,background-color] duration-500 ease-out"
          style={{ width: `${row.cap ? Math.max(pct, 4) : 0}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}
