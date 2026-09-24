import { Component, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Erreur non gérée dans Mon Budget :', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] px-6 text-center">
        <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Une erreur est survenue</p>
        <p className="max-w-sm text-[15px] text-[var(--color-ink-soft)]">
          Tes données sont enregistrées sur cet appareil et n'ont pas été touchées. Recharge la page pour continuer.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex h-14 items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 text-lg font-bold text-white transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
        >
          <RefreshCw size={20} aria-hidden="true" />
          Recharger
        </button>
      </div>
    )
  }
}
