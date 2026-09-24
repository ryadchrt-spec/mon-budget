import { useEffect, useState } from 'react'
import { Dashboard } from './components/dashboard/Dashboard'
import { EntryScreen } from './components/entry/EntryScreen'
import { SettingsScreen } from './components/settings/SettingsScreen'
import { ensureSeedData, migrateCategoryLimitsToGoals, migrateLegacyRecurringSeries } from './db/db'
import { addTransaction, updateTransaction, deleteTransaction, topUpRecurringSeries, useSettings } from './hooks/useBudgetData'
import type { Transaction } from './types'

type Screen = { name: 'dashboard' } | { name: 'entry'; editing: Transaction | null } | { name: 'settings' }

function defaultDateFor(year: number, month: number): string {
  const now = new Date()
  if (now.getFullYear() === year && now.getMonth() === month) {
    return now.toISOString()
  }
  return new Date(year, month, 1, 12).toISOString()
}

// Module-scoped so it survives React StrictMode's double-invoke of the mount effect (a fresh
// component instance still shares this module): the migrations and recurring top-up must each
// run exactly once per page load, not once per effect invocation.
let startupPromise: Promise<void> | null = null
function ensureStartup(): Promise<void> {
  if (!startupPromise) {
    startupPromise = ensureSeedData()
      .then(() => Promise.all([migrateCategoryLimitsToGoals(), migrateLegacyRecurringSeries()]))
      .then(() => topUpRecurringSeries())
  }
  return startupPromise
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [view, setView] = useState<'month' | 'year'>('month')
  const [screen, setScreen] = useState<Screen>({ name: 'dashboard' })

  const settings = useSettings()

  useEffect(() => {
    ensureStartup().then(() => setReady(true))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (!settings) return
    if (settings.theme === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', settings.theme)
  }, [settings])

  function goPrev() {
    if (view === 'month') {
      if (month === 0) {
        setMonth(11)
        setYear((y) => y - 1)
      } else {
        setMonth((m) => m - 1)
      }
    } else {
      setYear((y) => y - 1)
    }
  }

  function goNext() {
    if (view === 'month') {
      if (month === 11) {
        setMonth(0)
        setYear((y) => y + 1)
      } else {
        setMonth((m) => m + 1)
      }
    } else {
      setYear((y) => y + 1)
    }
  }

  async function handleSave(data: {
    type: Transaction['type']
    categoryId: string
    label: string
    amount: number
    date: string
    recurring: boolean
  }) {
    if (screen.name === 'entry' && screen.editing) {
      await updateTransaction(screen.editing, data)
    } else {
      await addTransaction(data)
    }
    setScreen({ name: 'dashboard' })
  }

  async function handleDelete() {
    if (screen.name === 'entry' && screen.editing) {
      await deleteTransaction(screen.editing.id)
    }
    setScreen({ name: 'dashboard' })
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <span className="text-[var(--color-ink-soft)]">Chargement…</span>
      </div>
    )
  }

  if (screen.name === 'entry') {
    return (
      <EntryScreen
        editing={screen.editing}
        defaultDate={defaultDateFor(year, month)}
        onSave={handleSave}
        onDelete={screen.editing ? handleDelete : undefined}
        onCancel={() => setScreen({ name: 'dashboard' })}
      />
    )
  }

  if (screen.name === 'settings') {
    return <SettingsScreen year={year} month={month} onBack={() => setScreen({ name: 'dashboard' })} />
  }

  return (
    <Dashboard
      year={year}
      month={month}
      view={view}
      onPrev={goPrev}
      onNext={goNext}
      onToggleView={() => setView((v) => (v === 'month' ? 'year' : 'month'))}
      onOpenSettings={() => setScreen({ name: 'settings' })}
      onAdd={() => setScreen({ name: 'entry', editing: null })}
      onEditTransaction={(t) => setScreen({ name: 'entry', editing: t })}
    />
  )
}
