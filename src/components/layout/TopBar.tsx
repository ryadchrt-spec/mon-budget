import { ChevronLeft, ChevronRight, Settings, CalendarRange, LayoutGrid } from 'lucide-react'
import { monthLabel } from '../../utils/format'

interface TopBarProps {
  year: number
  month: number
  view: 'month' | 'year'
  onPrev: () => void
  onNext: () => void
  onToggleView: () => void
  onOpenSettings: () => void
}

export function TopBar({ year, month, view, onPrev, onNext, onToggleView, onOpenSettings }: TopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">Mon Budget</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-soft)]">
          <button
            type="button"
            onClick={onPrev}
            aria-label={view === 'month' ? 'Mois précédent' : 'Année précédente'}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <span className="min-w-[10ch] px-1 text-center text-[15px] font-semibold text-[var(--color-ink)] sm:min-w-[14ch]">
            {view === 'month' ? monthLabel(year, month) : year}
          </span>
          <button
            type="button"
            onClick={onNext}
            aria-label={view === 'month' ? 'Mois suivant' : 'Année suivante'}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleView}
          aria-pressed={view === 'year'}
          className="flex h-[52px] items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[15px] font-semibold text-[var(--color-primary)] shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          {view === 'month' ? <CalendarRange size={20} aria-hidden="true" /> : <LayoutGrid size={20} aria-hidden="true" />}
          <span className="hidden sm:inline">{view === 'month' ? 'Vue annuelle' : 'Vue mensuelle'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Réglages"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <Settings size={22} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
