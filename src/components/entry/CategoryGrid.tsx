import { Plus } from 'lucide-react'
import { getIcon } from '../../data/icons'
import type { Category } from '../../types'

interface CategoryGridProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreateNew: () => void
}

export function CategoryGrid({ categories, selectedId, onSelect, onCreateNew }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {categories.map((cat) => {
        const Icon = getIcon(cat.icon)
        const selected = cat.id === selectedId
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            aria-pressed={selected}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
              selected
                ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[var(--shadow-lifted)] -translate-y-0.5'
                : 'border-transparent bg-[var(--color-surface)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5'
            }`}
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${cat.color}1f`, color: cat.color }}
            >
              <Icon size={24} strokeWidth={2.25} aria-hidden="true" />
            </span>
            <span className="line-clamp-2 text-[13px] font-semibold leading-tight text-[var(--color-ink)]">
              {cat.name}
            </span>
          </button>
        )
      })}

      <button
        type="button"
        onClick={onCreateNew}
        className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed border-[var(--color-border)] p-3 text-center text-[var(--color-ink-soft)] transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-surface-muted)]">
          <Plus size={24} aria-hidden="true" />
        </span>
        <span className="text-[13px] font-semibold leading-tight">Nouvelle</span>
      </button>
    </div>
  )
}
