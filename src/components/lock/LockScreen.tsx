import { useEffect, useRef, useState } from 'react'
import { Lock, Delete } from 'lucide-react'
import gsap from 'gsap'

const PIN = '2092'
const PIN_LENGTH = PIN.length

interface LockScreenProps {
  onUnlock: () => void
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [digits, setDigits] = useState('')
  const [error, setError] = useState(false)
  const dotsRef = useRef<HTMLDivElement>(null)

  function pressDigit(d: string) {
    if (digits.length >= PIN_LENGTH) return
    setError(false)
    const next = digits + d
    setDigits(next)
    if (next.length === PIN_LENGTH) {
      if (next === PIN) {
        onUnlock()
      } else {
        setError(true)
        if (dotsRef.current) {
          gsap.fromTo(
            dotsRef.current,
            { x: -10 },
            { x: 0, duration: 0.4, ease: 'elastic.out(1.2, 0.3)' },
          )
        }
        window.setTimeout(() => setDigits(''), 350)
      }
    }
  }

  function backspace() {
    setError(false)
    setDigits((d) => d.slice(0, -1))
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        pressDigit(e.key)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        backspace()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/70 backdrop-blur-md">
      <div className="mx-4 flex w-full max-w-xs flex-col items-center gap-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-lifted)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] text-[var(--color-primary)]">
          <Lock size={28} aria-hidden="true" />
        </div>

        <div className="text-center">
          <h1 className="font-heading text-xl font-bold text-[var(--color-ink)]">Application verrouillée</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Entre le code pour continuer</p>
        </div>

        <div ref={dotsRef} className="flex gap-3" aria-live="polite">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <span
              key={i}
              className={`h-4 w-4 rounded-full border-2 transition-colors ${
                error
                  ? 'border-[var(--color-danger)] bg-[var(--color-danger)]'
                  : i < digits.length
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-transparent'
              }`}
            />
          ))}
        </div>

        {error && <p className="-mt-3 text-sm font-medium text-[var(--color-danger)]">Code incorrect</p>}

        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => pressDigit(d)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] text-2xl font-bold text-[var(--color-ink)] transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              {d}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => pressDigit('0')}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] text-2xl font-bold text-[var(--color-ink)] transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            0
          </button>
          <button
            type="button"
            onClick={backspace}
            aria-label="Effacer"
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-[var(--color-ink-soft)] transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <Delete size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
