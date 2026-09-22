import type { Category, Transaction } from '../../types'
import { IconBadge } from '../ui/IconBadge'
import { formatEUR, dayLabel } from '../../utils/format'

interface TransactionRowProps {
  transaction: Transaction
  category: Category | undefined
  onClick?: () => void
  rank?: number
}

export function TransactionRow({ transaction, category, onClick, rank }: TransactionRowProps) {
  const isIncome = transaction.type === 'income'
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] active:scale-[0.99]"
    >
      {rank !== undefined && (
        <span className="w-5 shrink-0 text-center text-sm font-bold text-[var(--color-ink-soft)]">{rank}</span>
      )}
      <IconBadge icon={category?.icon ?? 'MoreHorizontal'} color={category?.color ?? '#78716c'} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-[var(--color-ink)]">{transaction.label}</div>
        <div className="text-xs text-[var(--color-ink-soft)]">
          {category?.name ?? 'Autre'} · {dayLabel(transaction.date)}
        </div>
      </div>
      <span
        className={`shrink-0 text-[15px] font-bold tabular-nums ${
          isIncome ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
        }`}
      >
        {isIncome ? '+ ' : '− '}
        {formatEUR(transaction.amount)}
      </span>
    </button>
  )
}
