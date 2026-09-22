import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatEUR } from '../../utils/format'
import type { Transaction } from '../../types'

const MONTH_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

export function AnnualView({ year, transactions }: { year: number; transactions: Transaction[] }) {
  const data = useMemo(() => {
    const rows = MONTH_SHORT.map((label, month) => ({ month: label, monthIndex: month, Revenus: 0, Dépenses: 0 }))
    for (const t of transactions) {
      const m = new Date(t.date).getMonth()
      if (t.type === 'income') rows[m].Revenus += t.amount
      else rows[m].Dépenses += t.amount
    }
    return rows
  }, [transactions])

  const totalIncome = data.reduce((s, r) => s + r.Revenus, 0)
  const totalExpense = data.reduce((s, r) => s + r.Dépenses, 0)
  const balance = totalIncome - totalExpense

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <span className="text-sm font-medium text-[var(--color-ink-soft)]">Solde de l'année {year}</span>
          <div
            className={`font-heading mt-1 text-3xl font-bold tabular-nums ${
              balance >= 0 ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
            }`}
          >
            {balance >= 0 ? '+ ' : '− '}
            {formatEUR(Math.abs(balance))}
          </div>
        </Card>
        <Card className="p-5">
          <span className="text-sm font-medium text-[var(--color-ink-soft)]">Total revenus</span>
          <div className="font-heading mt-1 text-3xl font-bold tabular-nums text-[var(--color-income)]">
            {formatEUR(totalIncome)}
          </div>
        </Card>
        <Card className="p-5">
          <span className="text-sm font-medium text-[var(--color-ink-soft)]">Total dépenses</span>
          <div className="font-heading mt-1 text-3xl font-bold tabular-nums text-[var(--color-ink)]">
            {formatEUR(totalExpense)}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 size={18} className="text-[var(--color-primary)]" aria-hidden="true" />
          <h3 className="font-heading text-lg font-semibold text-[var(--color-ink)]">Mois par mois</h3>
        </div>
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
                formatter={(value) => formatEUR(Number(value))}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)' }}
              />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: 13 }} />
              <Bar dataKey="Revenus" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Dépenses" fill="#0369a1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
