import { useState } from 'react'
import { Target } from 'lucide-react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { useCategoryGoals, setCategoryGoal, clearCategoryGoal } from '../../hooks/useBudgetData'
import { monthLabel } from '../../utils/format'
import type { Category } from '../../types'

function GoalInput({
  category,
  year,
  month,
  initialValue,
}: {
  category: Category
  year: number
  month: number
  initialValue: number | undefined
}) {
  const [value, setValue] = useState(initialValue !== undefined ? String(initialValue) : '')

  function commit() {
    const trimmed = value.trim()
    if (!trimmed) {
      clearCategoryGoal(year, month, category.id)
      return
    }
    const parsed = Number(trimmed.replace(',', '.'))
    if (parsed > 0) {
      setCategoryGoal(year, month, category.id, parsed)
    } else {
      setValue(initialValue !== undefined ? String(initialValue) : '')
    }
  }

  return (
    <div className="flex items-center gap-3 py-2.5">
      <IconBadge icon={category.icon} color={category.color} size="sm" />
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[var(--color-ink)]">{category.name}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          placeholder="Aucun"
          className="h-11 w-28 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-right text-[15px] text-[var(--color-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        />
        <span className="text-sm text-[var(--color-ink-soft)]">€</span>
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
  const goalByCategory = new Map((goals ?? []).map((g) => [g.categoryId, g.limit]))

  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center gap-2">
        <Target size={18} className="text-[var(--color-primary)]" aria-hidden="true" />
        <h2 className="font-heading text-lg font-semibold text-[var(--color-ink)]">
          Objectifs de {monthLabel(year, month)}
        </h2>
      </div>
      <p className="mb-3 text-sm text-[var(--color-ink-soft)]">
        Ces plafonds ne concernent que ce mois-ci. Change de mois sur le tableau de bord puis reviens ici pour en
        définir de nouveaux le mois suivant.
      </p>
      <div className="flex flex-col divide-y divide-[var(--color-border)]">
        {categories.map((category) => (
          <GoalInput
            key={`${year}-${month}-${category.id}`}
            category={category}
            year={year}
            month={month}
            initialValue={goalByCategory.get(category.id)}
          />
        ))}
        {categories.length === 0 && (
          <p className="py-4 text-center text-[15px] text-[var(--color-ink-soft)]">Aucune catégorie de dépense.</p>
        )}
      </div>
    </Card>
  )
}
