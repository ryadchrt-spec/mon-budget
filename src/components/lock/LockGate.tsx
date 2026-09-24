import { useEffect, useState, type ReactNode } from 'react'
import { LockScreen } from './LockScreen'

/**
 * Always starts locked (a fresh launch never trusts prior state), and re-locks whenever the
 * page is hidden — screen off, tab/app backgrounded, device locked — via the Page Visibility
 * API, the standard cross-platform signal for exactly that. The app underneath stays mounted
 * (state isn't lost) but blurred and non-interactive while locked.
 */
export function LockGate({ children }: { children: ReactNode }) {
  const [locked, setLocked] = useState(true)

  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) setLocked(true)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return (
    <>
      <div
        className={locked ? 'pointer-events-none blur-2xl select-none' : ''}
        aria-hidden={locked}
        inert={locked || undefined}
      >
        {children}
      </div>
      {locked && <LockScreen onUnlock={() => setLocked(false)} />}
    </>
  )
}
