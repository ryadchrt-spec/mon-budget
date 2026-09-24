import { useMemo } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card } from '../ui/Card'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { formatEUR } from '../../utils/format'
import { plannedExpenseTotal } from '../../utils/budget'
import { useStaggerReveal } from '../../hooks/useStaggerReveal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Category, Transaction, CategoryGoal } from '../../types'

const MONTH_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
const EXPENSE_COLOR = '#dc2626'
const EXPENSE_PROJECTED_COLOR = '#f3aca6'
const INCOME_COLOR = '#16a34a'

interface AnnualViewProps {
  year: number
  transactions: Transaction[]
  categories: Category[]
  allTransactions: Transaction[]
  goals: Map<string, CategoryGoal>
}

const signedEUR = (n: number) => `${n >= 0 ? '+ ' : '− '}${formatEUR(Math.abs(n))}`
const plusEUR = (n: number) => `+ ${formatEUR(n)}`
const minusEUR = (n: number) => `− ${formatEUR(n)}`

export function AnnualView({ year, transactions, categories, allTransactions, goals }: AnnualViewProps) {
  const reducedMotion = useReducedMotion()
  const revealRef = useStaggerReveal([year])

  const data = useMemo(() => {
    const now = new Date()
    const rows = MONTH_SHORT.map((label, month) => ({
      month: label,
      monthIndex: month,
      Revenus: 0,
      Dépenses: 0,
      isProjected: false,
    }))
    for (const t of transactions) {
      const m = new Date(t.date).getMonth()
      if (t.type === 'income') rows[m].Revenus += t.amount
      else rows[m].Dépenses += t.amount
    }
    for (const row of rows) {
      const isFuture = year > now.getFullYear() || (year === now.getFullYear() && row.monthIndex > now.getMonth())
      if (isFuture) {
        // Les paiements récurrents sont déjà de vraies transactions dans les mois à venir ;
        // on ne complète qu'avec les plafonds encore "en attente" pour ne pas compter deux fois.
        const planned = plannedExpenseTotal(year, row.monthIndex, categories, allTransactions, goals)
        if (planned > row.Dépenses) {
          row.Dépenses = planned
          row.isProjected = true
        }
      }
    }
    return rows
  }, [transactions, categories, allTransactions, year, goals])

  const totalIncome = data.reduce((s, r) => s + r.Revenus, 0)
  const totalExpense = data.reduce((s, r) => s + r.Dépenses, 0)
  const balance = totalIncome - totalExpense
  const hasProjection = data.some((r) => r.isProjected)

  return (
    <div ref={revealRef} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card data-anim-card className="p-5">
          <span className="text-sm font-medium text-[var(--color-ink-soft)]">Solde de l'année {year}</span>
          <AnimatedNumber
            value={balance}
            formatter={signedEUR}
            className={`font-heading mt-1 block text-3xl font-bold tabular-nums ${
              balance >= 0 ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
            }`}
          />
        </Card>
        <Card data-anim-card className="p-5">
          <span className="text-sm font-medium text-[var(--color-ink-soft)]">Total revenus</span>
          <AnimatedNumber
            value={totalIncome}
            formatter={plusEUR}
            className="font-heading mt-1 block text-3xl font-bold tabular-nums text-[var(--color-income)]"
          />
        </Card>
        <Card data-anim-card className="p-5">
          <span className="text-sm font-medium text-[var(--color-ink-soft)]">Total dépenses</span>
          <AnimatedNumber
            value={totalExpense}
            formatter={minusEUR}
            className="font-heading mt-1 block text-3xl font-bold tabular-nums text-[var(--color-danger)]"
          />
        </Card>
      </div>

      <Card data-anim-card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 size={18} className="text-[var(--color-primary)]" aria-hidden="true" />
          <h3 className="font-heading text-lg font-semibold text-[var(--color-ink)]">Mois par mois</h3>
        </div>
        {hasProjection && (
          <p className="mb-3 flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EXPENSE_PROJECTED_COLOR }} />
            Dépenses prévues (plafonds + paiements récurrents) pour les mois à venir
          </p>
        )}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontFamily: 'var(--font-body)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontFamily: 'var(--font-body)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatEUR(v, true)}
                width={64}
              />
              <Tooltip
                formatter={(value, name, entry) => {
                  const isExpense = name === 'Dépenses'
                  const projected = isExpense && (entry.payload as { isProjected: boolean }).isProjected
                  const sign = isExpense ? '− ' : '+ '
                  return [`${sign}${formatEUR(Number(value))}${projected ? ' (prévu)' : ''}`, name]
                }}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)' }}
              />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: 13 }} />
              <Bar
                dataKey="Revenus"
                fill={INCOME_COLOR}
                radius={[6, 6, 0, 0]}
                isAnimationActive={!reducedMotion}
                animationDuration={600}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="Dépenses"
                fill={EXPENSE_COLOR}
                radius={[6, 6, 0, 0]}
                isAnimationActive={!reducedMotion}
                animationDuration={600}
                animationEasing="ease-out"
              >
                {data.map((row) => (
                  <Cell key={row.month} fill={row.isProjected ? EXPENSE_PROJECTED_COLOR : EXPENSE_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
