import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { formatEUR } from '../../utils/format'
import type { CategoryBreakdown } from '../../utils/budget'

export function CategoryPie({ rows }: { rows: CategoryBreakdown[] }) {
  const data = rows.filter((r) => r.spent > 0)
  const total = data.reduce((sum, r) => sum + r.spent, 0)

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <PieIcon size={18} className="text-[var(--color-primary)]" aria-hidden="true" />
        <h3 className="font-heading text-lg font-semibold text-[var(--color-ink)]">Où part ton argent</h3>
      </div>

      {data.length === 0 ? (
        <p className="py-8 text-center text-[15px] text-[var(--color-ink-soft)]">
          Aucune dépense ce mois-ci pour l'instant.
        </p>
      ) : (
        <>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="spent"
                  nameKey={(d) => d.category.name}
                  innerRadius="55%"
                  outerRadius="90%"
                  paddingAngle={2}
                  stroke="var(--color-surface)"
                  strokeWidth={2}
                >
                  {data.map((row) => (
                    <Cell key={row.category.id} fill={row.category.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, entry) => [
                    `− ${formatEUR(Number(value))} (${Math.round(((entry.payload as CategoryBreakdown).spent / total) * 100)}%)`,
                    (entry.payload as CategoryBreakdown).category.name,
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--color-border)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex flex-col gap-2.5">
            {data
              .slice()
              .sort((a, b) => b.spent - a.spent)
              .map((row) => (
                <li key={row.category.id} className="flex items-center gap-3">
                  <IconBadge icon={row.category.icon} color={row.category.color} size="sm" />
                  <span className="flex-1 truncate text-[15px] font-medium text-[var(--color-ink)]">
                    {row.category.name}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-[var(--color-ink-soft)]">
                    {Math.round((row.spent / total) * 100)}%
                  </span>
                  <span className="w-24 shrink-0 text-right text-[15px] font-semibold tabular-nums text-[var(--color-danger)]">
                    − {formatEUR(row.spent)}
                  </span>
                </li>
              ))}
          </ul>
        </>
      )}
    </Card>
  )
}
