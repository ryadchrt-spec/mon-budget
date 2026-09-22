import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { TransactionRow } from './TransactionRow'
import { formatEUR } from '../../utils/format'
import type { Category, Transaction, TransactionType } from '../../types'

interface TransactionListProps {
  type: TransactionType
  transactions: Transaction[]
  categories: Category[]
  total: number
  onEdit: (transaction: Transaction) => void
}

export function TransactionList({ type, transactions, categories, total, onEdit }: TransactionListProps) {
  const byId = new Map(categories.map((c) => [c.id, c]))
  const isIncome = type === 'income'

  return (
    <Card className="flex max-h-[26rem] flex-col p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isIncome ? (
            <ArrowUpCircle size={18} className="text-[var(--color-income)]" aria-hidden="true" />
          ) : (
            <ArrowDownCircle size={18} className="text-[var(--color-ink-soft)]" aria-hidden="true" />
          )}
          <h3 className="font-heading text-lg font-semibold text-[var(--color-ink)]">
            {isIncome ? 'Revenus' : 'Dépenses'}
          </h3>
        </div>
        <span
          className={`font-heading text-lg font-bold tabular-nums ${
            isIncome ? 'text-[var(--color-income)]' : 'text-[var(--color-ink)]'
          }`}
        >
          {formatEUR(total)}
        </span>
      </div>
      {transactions.length === 0 ? (
        <p className="flex flex-1 items-center justify-center py-6 text-center text-[15px] text-[var(--color-ink-soft)]">
          {isIncome ? 'Aucun revenu ce mois-ci.' : 'Aucune dépense ce mois-ci.'}
        </p>
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto">
          {transactions.map((t) => (
            <TransactionRow key={t.id} transaction={t} category={byId.get(t.categoryId)} onClick={() => onEdit(t)} />
          ))}
        </div>
      )}
    </Card>
  )
}
