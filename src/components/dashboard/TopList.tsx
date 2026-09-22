import { Trophy } from 'lucide-react'
import { Card } from '../ui/Card'
import { TransactionRow } from './TransactionRow'
import type { Category, Transaction } from '../../types'

interface TopListProps {
  title: string
  transactions: Transaction[]
  categories: Category[]
  onEdit: (transaction: Transaction) => void
  emptyLabel: string
}

export function TopList({ title, transactions, categories, onEdit, emptyLabel }: TopListProps) {
  const byId = new Map(categories.map((c) => [c.id, c]))
  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center gap-2">
        <Trophy size={18} className="text-[var(--color-warning)]" aria-hidden="true" />
        <h3 className="font-heading text-lg font-semibold text-[var(--color-ink)]">{title}</h3>
      </div>
      {transactions.length === 0 ? (
        <p className="py-6 text-center text-[15px] text-[var(--color-ink-soft)]">{emptyLabel}</p>
      ) : (
        <div className="flex flex-col">
          {transactions.map((t, i) => (
            <TransactionRow
              key={t.id}
              transaction={t}
              category={byId.get(t.categoryId)}
              rank={i + 1}
              onClick={() => onEdit(t)}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
