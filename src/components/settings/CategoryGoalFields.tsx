import { useEffect, useState } from 'react'
import { useCategoryGoals, setCategoryGoal } from '../../hooks/useBudgetData'

function parseAmount(raw: string): number | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed.replace(',', '.'))
  return parsed > 0 ? parsed : undefined
}

export function AmountField({
  label,
  value,
  onChange,
  onBlur,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  disabled?: boolean
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-[var(--color-ink-soft)]">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="Aucun"
          className="h-11 w-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-right text-[15px] text-[var(--color-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50"
        />
        <span className="text-sm text-[var(--color-ink-soft)]">€</span>
      </div>
    </label>
  )
}

/**
 * The two per-month euro fields (alert threshold, limit) for one category, wherever they're
 * needed (the bulk "Objectifs du mois" list, or inline in a single category's edit screen).
 *
 * The local input state re-syncs from the loaded goal via an effect instead of a one-shot
 * useState initializer, because useCategoryGoals resolves asynchronously (Dexie liveQuery) —
 * a lazy initializer would freeze on the pre-load empty string forever. Committing is also
 * gated on `loaded`: since setCategoryGoal deletes the goal when both fields are empty, saving
 * before the real value has arrived could wipe out an existing goal on a stray blur.
 */
export function CategoryGoalFields({ year, month, categoryId }: { year: number; month: number; categoryId: string }) {
  const goals = useCategoryGoals(year, month)
  const loaded = goals !== undefined
  const goal = goals?.find((g) => g.categoryId === categoryId)

  const [alertAmount, setAlertAmount] = useState(goal?.alertAmount !== undefined ? String(goal.alertAmount) : '')
  const [limit, setLimit] = useState(goal?.limit !== undefined ? String(goal.limit) : '')

  useEffect(() => {
    if (!loaded) return
    setAlertAmount(goal?.alertAmount !== undefined ? String(goal.alertAmount) : '')
    setLimit(goal?.limit !== undefined ? String(goal.limit) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, goal?.alertAmount, goal?.limit])

  function commit() {
    if (!loaded) return
    setCategoryGoal(year, month, categoryId, { alertAmount: parseAmount(alertAmount), limit: parseAmount(limit) })
  }

  return (
    <div className="flex items-center gap-3">
      <AmountField label="Seuil d'alerte" value={alertAmount} onChange={setAlertAmount} onBlur={commit} disabled={!loaded} />
      <AmountField label="Limite" value={limit} onChange={setLimit} onBlur={commit} disabled={!loaded} />
    </div>
  )
}
