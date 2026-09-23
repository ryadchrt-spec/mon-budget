import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Trash2, Repeat } from 'lucide-react'
import gsap from 'gsap'
import { Keypad } from './Keypad'
import { CategoryGrid } from './CategoryGrid'
import { DatePicker } from './DatePicker'
import { Modal } from '../ui/Modal'
import { CategoryForm, type CategoryFormValue } from '../settings/CategoryForm'
import { useCategories } from '../../hooks/useBudgetData'
import { addCategory } from '../../hooks/useBudgetData'
import { toDateInputValue, fromDateInputValue } from '../../utils/format'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Transaction, TransactionType } from '../../types'

interface EntryScreenProps {
  editing?: Transaction | null
  defaultDate: string
  onSave: (data: {
    type: TransactionType
    categoryId: string
    label: string
    amount: number
    date: string
    recurring: boolean
  }) => void
  onDelete?: () => void
  onCancel: () => void
}

function parseAmount(raw: string): number {
  if (!raw) return 0
  const normalized = raw.endsWith(',') ? raw.slice(0, -1) : raw
  return Number(normalized.replace(',', '.')) || 0
}

export function EntryScreen({ editing, defaultDate, onSave, onDelete, onCancel }: EntryScreenProps) {
  const [sign, setSign] = useState<TransactionType>(editing?.type ?? 'expense')
  const [raw, setRaw] = useState(editing ? String(editing.amount).replace('.', ',') : '')
  const [categoryId, setCategoryId] = useState<string | null>(editing?.categoryId ?? null)
  const [label, setLabel] = useState(editing?.label ?? '')
  const [date, setDate] = useState(toDateInputValue(editing?.date ?? defaultDate))
  const [recurring, setRecurring] = useState(editing?.recurring ?? false)
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const amountRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  const categories = useCategories(sign)

  const prevSignRef = useRef(sign)
  useEffect(() => {
    if (prevSignRef.current !== sign) {
      prevSignRef.current = sign
      setCategoryId(null)
    }
  }, [sign])

  function flashKey(key: string) {
    setPressedKey(key)
    window.setTimeout(() => setPressedKey((k) => (k === key ? null : k)), 130)
  }

  function handleDigit(d: string) {
    flashKey(d)
    setRaw((prev) => {
      const [intPart, decPart] = prev.split(',')
      if (decPart !== undefined) {
        if (decPart.length >= 2) return prev
        return `${intPart},${decPart}${d}`
      }
      if (intPart && intPart.length >= 7) return prev
      if (intPart === '0') return d === '0' ? prev : d
      return `${intPart ?? ''}${d}`
    })
  }

  function handleComma() {
    flashKey(',')
    setRaw((prev) => {
      if (prev.includes(',')) return prev
      return `${prev || '0'},`
    })
  }

  function handleBackspace() {
    flashKey('Backspace')
    setRaw((prev) => prev.slice(0, -1))
  }

  function handleSign(next: TransactionType) {
    flashKey(next === 'income' ? '+' : '-')
    setSign(next)
  }

  useEffect(() => {
    if (reducedMotion || !amountRef.current) return
    gsap.fromTo(amountRef.current, { scale: 1.12 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
  }, [raw, reducedMotion])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const activeTag = (document.activeElement as HTMLElement | null)?.tagName
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
        if (e.key === 'Escape') onCancel()
        return
      }
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        handleDigit(e.key)
      } else if (e.key === ',' || e.key === '.') {
        e.preventDefault()
        handleComma()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        handleBackspace()
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        handleSign('income')
      } else if (e.key === '-') {
        e.preventDefault()
        handleSign('expense')
      } else if (e.key === 'Enter') {
        e.preventDefault()
        submit()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  const amount = parseAmount(raw)
  const canSubmit = amount > 0 && !!categoryId

  function submit() {
    if (!canSubmit || !categoryId) return
    onSave({
      type: sign,
      categoryId,
      label: label.trim() || categories?.find((c) => c.id === categoryId)?.name || '',
      amount,
      date: fromDateInputValue(date),
      recurring,
    })
  }

  async function handleCreateCategory(value: CategoryFormValue) {
    await addCategory(value)
    setShowNewCategory(false)
  }

  const displayValue = raw ? raw : '0'

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-8 pt-5 sm:px-6">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Retour"
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </button>
        <h1 className="font-heading text-lg font-bold text-[var(--color-ink)]">
          {editing ? 'Modifier' : 'Nouvelle opération'}
        </h1>
        {editing && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Supprimer cette opération"
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger-soft)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
          >
            <Trash2 size={22} aria-hidden="true" />
          </button>
        ) : (
          <div className="h-12 w-12" />
        )}
      </div>

      <div className="my-4 flex flex-col items-center justify-center py-3 text-center">
        <span
          className={`text-sm font-semibold uppercase tracking-wide ${
            sign === 'income' ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
          }`}
        >
          {sign === 'income' ? 'Revenu' : 'Dépense'}
        </span>
        <span
          ref={amountRef}
          className={`font-heading inline-block text-6xl font-extrabold tabular-nums transition-colors sm:text-7xl ${
            sign === 'income' ? 'text-[var(--color-income)]' : 'text-[var(--color-danger)]'
          }`}
        >
          {displayValue} <span className="text-3xl font-bold sm:text-4xl">€</span>
        </span>
      </div>

      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Nom (ex : Courses Carrefour)"
        className="mb-3 h-14 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-center text-[17px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-soft)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      />

      <div className="mb-5 flex flex-col gap-2.5 sm:flex-row">
        <DatePicker value={date} onChange={setDate} />
        <button
          type="button"
          onClick={() => setRecurring((r) => !r)}
          aria-pressed={recurring}
          className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-2 text-[15px] font-semibold transition-colors active:scale-[0.98] ${
            recurring
              ? 'border-[var(--color-primary)] bg-[var(--color-surface-muted)] text-[var(--color-primary)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-soft)]'
          }`}
        >
          <Repeat size={19} aria-hidden="true" />
          {recurring ? 'Se répète chaque mois' : 'Paiement unique'}
        </button>
      </div>

      <div className="mb-5">
        <CategoryGrid
          categories={categories ?? []}
          selectedId={categoryId}
          onSelect={setCategoryId}
          onCreateNew={() => setShowNewCategory(true)}
        />
      </div>

      <div className="mb-5">
        <Keypad
          sign={sign}
          onDigit={handleDigit}
          onComma={handleComma}
          onBackspace={handleBackspace}
          onSign={handleSign}
          pressedKey={pressedKey}
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-[var(--color-income)] text-xl font-bold text-white shadow-[var(--shadow-lifted)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-income)]"
      >
        <Check size={26} strokeWidth={3} aria-hidden="true" />
        Valider
      </button>

      {showNewCategory && (
        <Modal title="Nouvelle catégorie" onClose={() => setShowNewCategory(false)}>
          <CategoryForm defaultType={sign} onSubmit={handleCreateCategory} />
        </Modal>
      )}
    </div>
  )
}
