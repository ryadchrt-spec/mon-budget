import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ui/ErrorBoundary.tsx'
import { LockGate } from './components/lock/LockGate.tsx'

// A new service worker taking over means a new version was deployed — reload right away
// instead of leaving the tab stuck on stale JS until the person happens to notice.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}

const updateSW = registerSW({ immediate: true })
// Check for a new deploy whenever the app regains focus, not just on cold start.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') updateSW()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LockGate>
        <App />
      </LockGate>
    </ErrorBoundary>
  </StrictMode>,
)
