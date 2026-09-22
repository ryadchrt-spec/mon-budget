import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-[1.75rem] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-lifted)] sm:max-w-lg sm:rounded-[1.75rem] sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-[var(--color-ink)]">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  )
}
