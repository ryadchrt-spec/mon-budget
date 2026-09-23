import { useEffect, useRef, type MouseEvent } from 'react'
import { Plus } from 'lucide-react'
import gsap from 'gsap'
import { getIcon } from '../../data/icons'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Category } from '../../types'

interface CategoryGridProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreateNew: () => void
}

export function CategoryGrid({ categories, selectedId, onSelect, onCreateNew }: CategoryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !gridRef.current) return
    const targets = gridRef.current.querySelectorAll('button')
    if (targets.length === 0) return
    const tween = gsap.fromTo(
      targets,
      { opacity: 0, scale: 0.85, y: 10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        stagger: { each: 0.035, from: 'start', grid: 'auto' },
        ease: 'back.out(1.6)',
        clearProps: 'opacity,transform',
        overwrite: true,
      },
    )
    return () => {
      tween.kill()
    }
  }, [categories, reducedMotion])

  function handleSelect(id: string, e: MouseEvent<HTMLButtonElement>) {
    onSelect(id)
    if (reducedMotion) return
    const icon = e.currentTarget.querySelector('span')
    if (!icon) return
    gsap.fromTo(icon, { scale: 0.55, rotate: -12 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: true })
  }

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {categories.map((cat) => {
        const Icon = getIcon(cat.icon)
        const selected = cat.id === selectedId
        return (
          <button
            key={cat.id}
            type="button"
            onClick={(e) => handleSelect(cat.id, e)}
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
