import { Target } from 'lucide-react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { CategoryGoalFields } from './CategoryGoalFields'
import { monthLabel } from '../../utils/format'
import type { Category } from '../../types'

export function CategoryGoalsSection({
  year,
  month,
  categories,
}: {
  year: number
  month: number
  categories: Category[]
}) {
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
          <div key={category.id} className="flex flex-wrap items-center gap-3 py-2.5">
            <IconBadge icon={category.icon} color={category.color} size="sm" />
            <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[var(--color-ink)]">
              {category.name}
            </span>
            <CategoryGoalFields year={year} month={month} categoryId={category.id} />
          </div>
        ))}
        {categories.length === 0 && (
          <p className="py-4 text-center text-[15px] text-[var(--color-ink-soft)]">Aucune catégorie de dépense.</p>
        )}
      </div>
    </Card>
  )
}
