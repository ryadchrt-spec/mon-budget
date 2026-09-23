import { useEffect, useState } from 'react'

/**
 * Measures the rendered height of the returned ref's element and mirrors it
 * back as a pixel value, but only at/above `minWidth` (below that, columns
 * stack and each card should size itself naturally instead).
 *
 * Uses a callback ref (not useRef) so the observer re-attaches whenever the
 * element itself is unmounted/remounted (e.g. switching year/month view),
 * instead of freezing on a stale measurement from a detached node.
 */
export function useMatchHeight(minWidth = 1024) {
  const [node, setNode] = useState<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!node) return
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`)

    const update = () => setHeight(mql.matches ? node.getBoundingClientRect().height : undefined)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(node)
    mql.addEventListener('change', update)
    return () => {
      ro.disconnect()
      mql.removeEventListener('change', update)
    }
  }, [node, minWidth])

  return { ref: setNode, height }
}
