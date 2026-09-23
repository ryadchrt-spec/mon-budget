import { useMemo } from 'react'
import { TopBar } from '../layout/TopBar'
import { AddFab } from '../layout/AddFab'
import { AlertBanner } from './AlertBanner'
import { MonthSummary } from './MonthSummary'
import { CategoryPie } from './CategoryPie'
import { CategoryProgressList } from './CategoryProgressList'
import { MonthBarColumns } from './MonthBarColumns'
import { TopList } from './TopList'
import { TopCategoryList } from './TopCategoryList'
import { TransactionList } from './TransactionList'
import { AnnualView } from './AnnualView'
import { useStaggerReveal } from '../../hooks/useStaggerReveal'
import {
  useAllCategories,
  useMonthTransactions,
  useYearTransactions,
  useAllTransactions,
  useSettings,
  useCumulativeReserve,
} from '../../hooks/useBudgetData'
import { sumByType, topTransactions, categoryBreakdown, biggestExpenseCategory, plannedExpenseTotal } from '../../utils/budget'
import type { Transaction } from '../../types'

interface DashboardProps {
  year: number
  month: number
  view: 'month' | 'year'
  onPrev: () => void
  onNext: () => void
  onToggleView: () => void
  onOpenSettings: () => void
  onAdd: () => void
  onEditTransaction: (t: Transaction) => void
}

export function Dashboard({ year, month, view, onPrev, onNext, onToggleView, onOpenSettings, onAdd, onEditTransaction }: DashboardProps) {
  const categories = useAllCategories()
  const monthTransactions = useMonthTransactions(year, month)
  const yearTransactions = useYearTransactions(year)
  const allTransactions = useAllTransactions()
  const settings = useSettings()
  const reserve = useCumulativeReserve(year, month)

  const totalIncome = useMemo(() => sumByType(monthTransactions ?? [], 'income'), [monthTransactions])
  const totalExpense = useMemo(() => sumByType(monthTransactions ?? [], 'expense'), [monthTransactions])

  const breakdown = useMemo(
    () =>
      categoryBreakdown(monthTransactions ?? [], categories ?? [], totalIncome, settings?.defaultAlertThreshold ?? 50),
    [monthTransactions, categories, totalIncome, settings],
  )

  const biggest = useMemo(() => biggestExpenseCategory(breakdown), [breakdown])
  const plannedTotal = useMemo(
    () => plannedExpenseTotal(year, month, categories ?? [], allTransactions ?? []),
    [year, month, categories, allTransactions],
  )
  const topExpenses = useMemo(() => topTransactions(monthTransactions ?? [], 'expense', 5), [monthTransactions])
  const topIncomes = useMemo(() => topTransactions(monthTransactions ?? [], 'income', 5), [monthTransactions])

  const incomeList = useMemo(
    () => (monthTransactions ?? []).filter((t) => t.type === 'income'),
    [monthTransactions],
  )
  const expenseList = useMemo(
    () => (monthTransactions ?? []).filter((t) => t.type === 'expense'),
    [monthTransactions],
  )

  const revealRef = useStaggerReveal([year, month, view])

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 px-4 pb-28 pt-5 sm:px-6">
      <TopBar
        year={year}
        month={month}
        view={view}
        onPrev={onPrev}
        onNext={onNext}
        onToggleView={onToggleView}
        onOpenSettings={onOpenSettings}
      />

      {view === 'year' ? (
        <AnnualView
          year={year}
          transactions={yearTransactions ?? []}
          categories={categories ?? []}
          allTransactions={allTransactions ?? []}
        />
      ) : (
        <div ref={revealRef} className="flex flex-col gap-5">
          <AlertBanner rows={breakdown} />
          <MonthSummary totalIncome={totalIncome} totalExpense={totalExpense} reserve={reserve ?? 0} biggest={biggest} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <CategoryPie rows={breakdown} />
            <MonthBarColumns totalIncome={totalIncome} totalExpense={totalExpense} />
            <CategoryProgressList rows={breakdown} plannedTotal={plannedTotal} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <TopCategoryList rows={breakdown} />
            <TopList
              title="Top des dépenses (uniques)"
              transactions={topExpenses}
              categories={categories ?? []}
              onEdit={onEditTransaction}
              emptyLabel="Aucune dépense ce mois-ci."
            />
            <TopList
              title="Top des revenus"
              transactions={topIncomes}
              categories={categories ?? []}
              onEdit={onEditTransaction}
              emptyLabel="Aucun revenu ce mois-ci."
            />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TransactionList
              type="income"
              transactions={incomeList}
              categories={categories ?? []}
              total={totalIncome}
              onEdit={onEditTransaction}
            />
            <TransactionList
              type="expense"
              transactions={expenseList}
              categories={categories ?? []}
              total={totalExpense}
              onEdit={onEditTransaction}
            />
          </div>
        </div>
      )}

      <AddFab onClick={onAdd} />
    </div>
  )
}
