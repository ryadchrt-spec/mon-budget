import { useEffect, useRef } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import gsap from 'gsap'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { formatEUR } from '../../utils/format'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { CategoryBreakdown } from '../../utils/budget'

const minusEUR = (n: number) => `− ${formatEUR(n)}`

export function CategoryPie({ rows, matchHeight }: { rows: CategoryBreakdown[]; matchHeight?: number }) {
  const data = rows.filter((r) => r.spent > 0)
  const total = data.reduce((sum, r) => sum + r.spent, 0)
  const listRef = useRef<HTMLUListElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !listRef.current) return
    const targets = listRef.current.querySelectorAll('li')
    if (targets.length === 0) return
    const tween = gsap.fromTo(
      targets,
      { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power1.out', clearProps: 'opacity,transform', overwrite: true },
    )
    return () => {
      tween.kill()
    }
  }, [rows, reducedMotion])

  return (
    <Card data-anim-card className="flex flex-col p-5" style={matchHeight ? { height: matchHeight } : undefined}>
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
          <div className="h-56 w-full shrink-0">
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
                  isAnimationActive={!reducedMotion}
                  animationDuration={700}
                  animationEasing="ease-out"
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
          <ul ref={listRef} className="scrollbar-soft mt-2 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
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
                  <AnimatedNumber
                    value={row.spent}
                    formatter={minusEUR}
                    className="w-24 shrink-0 text-right text-[15px] font-semibold tabular-nums text-[var(--color-danger)]"
                  />
                </li>
              ))}
          </ul>
        </>
      )}
    </Card>
  )
}
