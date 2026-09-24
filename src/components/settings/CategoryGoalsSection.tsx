import { useState } from 'react'
import { Target } from 'lucide-react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { useCategoryGoals, setCategoryGoal } from '../../hooks/useBudgetData'
import { monthLabel } from '../../utils/format'
import type { Category, CategoryGoal } from '../../types'

function AmountField({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
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
          placeholder="Aucun"
          className="h-11 w-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-right text-[15px] text-[var(--color-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        />
        <span className="text-sm text-[var(--color-ink-soft)]">€</span>
      </div>
    </label>
  )
}

function GoalRow({
  category,
  year,
  month,
  initial,
}: {
  category: Category
  year: number
  month: number
  initial: CategoryGoal | undefined
}) {
  const [alertAmount, setAlertAmount] = useState(initial?.alertAmount !== undefined ? String(initial.alertAmount) : '')
  const [limit, setLimit] = useState(initial?.limit !== undefined ? String(initial.limit) : '')

  function parse(raw: string): number | undefined {
    const trimmed = raw.trim()
    if (!trimmed) return undefined
    const parsed = Number(trimmed.replace(',', '.'))
    return parsed > 0 ? parsed : undefined
  }

  function commit() {
    setCategoryGoal(year, month, category.id, { alertAmount: parse(alertAmount), limit: parse(limit) })
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-2.5">
      <IconBadge icon={category.icon} color={category.color} size="sm" />
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[var(--color-ink)]">{category.name}</span>
      <div className="flex items-center gap-3">
        <AmountField label="Seuil d'alerte" value={alertAmount} onChange={setAlertAmount} onBlur={commit} />
        <AmountField label="Limite" value={limit} onChange={setLimit} onBlur={commit} />
      </div>
    </div>
  )
}

export function CategoryGoalsSection({
  year,
  month,
  categories,
}: {
  year: number
  month: number
  categories: Category[]
}) {
  const goals = useCategoryGoals(year, month)
  const goalByCategory = new Map((goals ?? []).map((g) => [g.categoryId, g]))

  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center gap-2">
        <Target size={18} className="text-[var(--color-primary)]" aria-hidden="true" />
        <h2 className="font-heading text-lg font-semibold text-[var(--color-ink)]">
          Objectifs de {monthLabel(year, month)}
        </h2>
      </div>
      <p className="mb-3 text-sm text-[var(--color-ink-soft)]">
        Seuil d'alerte (orange) et limite (rouge), en euros, propres à ce mois-ci. Change de mois sur le tableau de
        bord puis reviens ici pour en définir de nouveaux le mois suivant.
      </p>
      <div className="flex flex-col divide-y divide-[var(--color-border)]">
        {categories.map((category) => (
          <GoalRow
            key={`${year}-${month}-${category.id}`}
            category={category}
            year={year}
            month={month}
            initial={goalByCategory.get(category.id)}
          />
        ))}
        {categories.length === 0 && (
          <p className="py-4 text-center text-[15px] text-[var(--color-ink-soft)]">Aucune catégorie de dépense.</p>
        )}
      </div>
    </Card>
  )
}
