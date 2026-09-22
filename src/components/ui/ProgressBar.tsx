import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { CategoryBreakdown } from '../../utils/budget'
import { formatEUR } from '../../utils/format'

const STATUS_STYLES: Record<CategoryBreakdown['status'], { bar: string; track: string; text: string }> = {
  ok: { bar: 'bg-[var(--color-primary)]', track: 'bg-[var(--color-surface-muted)]', text: 'text-[var(--color-ink-soft)]' },
  warning: { bar: 'bg-[var(--color-warning)]', track: 'bg-[var(--color-warning-soft)]', text: 'text-[var(--color-warning)]' },
  danger: { bar: 'bg-[var(--color-danger)]', track: 'bg-[var(--color-danger-soft)]', text: 'text-[var(--color-danger)]' },
}

export function CategoryProgressBar({ row }: { row: CategoryBreakdown }) {
  const styles = STATUS_STYLES[row.status]
  const pct = row.cap ? Math.min(100, Math.round(row.ratio * 100)) : 0

  return (
    <div className="py-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="truncate text-[15px] font-medium text-[var(--color-ink)]">{row.category.name}</span>
        <span className={`flex items-center gap-1 text-sm font-semibold ${styles.text}`}>
          {row.status === 'danger' && <AlertTriangle size={15} aria-hidden="true" />}
          {row.status === 'ok' && row.cap && <CheckCircle2 size={14} className="text-[var(--color-income)]" aria-hidden="true" />}
          {formatEUR(row.spent)}
          {row.cap ? <span className="font-normal text-[var(--color-ink-soft)]"> / {formatEUR(row.cap)}</span> : null}
        </span>
      </div>
      <div className={`h-3 w-full overflow-hidden rounded-full ${styles.track}`}>
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${styles.bar}`}
          style={{ width: `${row.cap ? Math.max(pct, 4) : 0}%` }}
        />
      </div>
    </div>
  )
}
