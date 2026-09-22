import { Plus } from 'lucide-react'

export function AddFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ajouter une dépense ou un revenu"
      className="fixed bottom-6 right-6 z-30 flex h-16 items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 text-[var(--color-on-primary)] shadow-[var(--shadow-lifted)] transition-transform hover:bg-[var(--color-primary-dark)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] sm:bottom-8 sm:right-8"
    >
      <Plus size={26} strokeWidth={2.75} aria-hidden="true" />
      <span className="text-lg font-bold">Ajouter</span>
    </button>
  )
}
