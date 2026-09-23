import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { formatFullDate } from '../../utils/format'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

interface DayCell {
  day: number
  year: number
  month: number
  inMonth: boolean
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function buildGrid(year: number, month: number): DayCell[] {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const cells: DayCell[] = []

  for (let i = 0; i < firstWeekday; i++) {
    const day = daysInPrevMonth - firstWeekday + 1 + i
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    cells.push({ day, year: prevYear, month: prevMonth, inMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, year, month, inMonth: true })
  }
  const trailing = (7 - (cells.length % 7)) % 7
  for (let day = 1; day <= trailing; day++) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    cells.push({ day, year: nextYear, month: nextMonth, inMonth: false })
  }
  return cells
}

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [y, m] = value.split('-').map(Number)
  const [viewYear, setViewYear] = useState(y)
  const [viewMonth, setViewMonth] = useState(m - 1)

  const today = new Date()
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate())

  function openPicker() {
    setViewYear(y)
    setViewMonth(m - 1)
    setOpen(true)
  }

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((yy) => yy - 1)
    } else {
      setViewMonth((mm) => mm - 1)
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((yy) => yy + 1)
    } else {
      setViewMonth((mm) => mm + 1)
    }
  }

  function pick(cell: DayCell) {
    onChange(toISO(cell.year, cell.month, cell.day))
    setOpen(false)
  }

  const cells = buildGrid(viewYear, viewMonth)

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        className="flex h-14 flex-1 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-left transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <CalendarDays size={19} className="shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
        <span className="truncate text-[15px] font-medium text-[var(--color-ink)]">{formatFullDate(value)}</span>
      </button>

      {open && (
        <Modal title="Choisis une date" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goPrevMonth}
                aria-label="Mois précédent"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <span className="font-heading text-lg font-bold text-[var(--color-ink)]">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={goNextMonth}
                aria-label="Mois suivant"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((w, i) => (
                <div key={i} className="flex h-8 items-center justify-center text-xs font-semibold text-[var(--color-ink-soft)]">
                  {w}
                </div>
              ))}
              {cells.map((cell) => {
                const iso = toISO(cell.year, cell.month, cell.day)
                const selected = iso === value
                const isToday = iso === todayISO
                return (
                  <button
                    key={`${cell.year}-${cell.month}-${cell.day}-${cell.inMonth}`}
                    type="button"
                    onClick={() => pick(cell)}
                    className={`flex h-11 items-center justify-center rounded-xl text-[15px] font-semibold transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                      selected
                        ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-soft)]'
                        : cell.inMonth
                          ? 'text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]'
                          : 'text-[var(--color-ink-soft)]/40 hover:bg-[var(--color-surface-muted)]'
                    } ${isToday && !selected ? 'ring-2 ring-[var(--color-primary)]/50' : ''}`}
                  >
                    {cell.day}
                  </button>
                )
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
