import { Delete } from 'lucide-react'

interface KeypadProps {
  onDigit: (digit: string) => void
  onComma: () => void
  onBackspace: () => void
  onSign: (sign: 'income' | 'expense') => void
  sign: 'income' | 'expense'
  pressedKey: string | null
}

const DIGIT_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
]

export function Keypad({ onDigit, onComma, onBackspace, onSign, sign, pressedKey }: KeypadProps) {
  const keyClass = (key: string) =>
    `flex h-16 items-center justify-center rounded-2xl text-2xl font-bold transition-transform duration-100 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] sm:h-[4.5rem] ${
      pressedKey === key ? 'scale-90' : ''
    }`

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
      <div className="col-span-3 grid grid-cols-3 gap-2.5 sm:gap-3">
        {DIGIT_ROWS.flat().map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onDigit(d)}
            className={`${keyClass(d)} bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-surface-muted)]`}
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={onComma}
          className={`${keyClass(',')} bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-surface-muted)]`}
          aria-label="Virgule, pour les centimes"
        >
          ,
        </button>
        <button
          key="0"
          type="button"
          onClick={() => onDigit('0')}
          className={`${keyClass('0')} bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-surface-muted)]`}
        >
          0
        </button>
        <button
          type="button"
          onClick={onBackspace}
          className={`${keyClass('Backspace')} bg-[var(--color-surface)] text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-surface-muted)]`}
          aria-label="Effacer le dernier chiffre"
        >
          <Delete size={26} aria-hidden="true" />
        </button>
      </div>

      <div className="col-span-1 grid grid-rows-3 gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => onSign('income')}
          aria-pressed={sign === 'income'}
          className={`${keyClass('+')} row-span-1 ${
            sign === 'income'
              ? 'bg-[var(--color-income)] text-white shadow-[var(--shadow-lifted)]'
              : 'bg-[var(--color-income-soft)] text-[var(--color-income)] hover:brightness-95'
          }`}
          aria-label="Revenu (plus)"
        >
          +
        </button>
        <div className="row-span-1 flex items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs font-medium text-[var(--color-ink-soft)]">
          {sign === 'income' ? 'Revenu' : 'Dépense'}
        </div>
        <button
          type="button"
          onClick={() => onSign('expense')}
          aria-pressed={sign === 'expense'}
          className={`${keyClass('-')} row-span-1 ${
            sign === 'expense'
              ? 'bg-[var(--color-danger)] text-white shadow-[var(--shadow-lifted)]'
              : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)] hover:brightness-95'
          }`}
          aria-label="Dépense (moins)"
        >
          −
        </button>
      </div>
    </div>
  )
}
