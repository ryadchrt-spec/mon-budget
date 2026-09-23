import { useEffect, useState } from 'react'

/**
 * Measures the rendered height of the returned ref's element, updating on resize.
 *
 * Uses a callback ref (not useRef) so the observer re-attaches whenever the
 * element itself is unmounted/remounted, instead of freezing on a stale
 * measurement from a detached node.
 */
export function useElementHeight<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!node) return
    const update = () => setHeight(node.getBoundingClientRect().height)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(node)
    return () => ro.disconnect()
  }, [node])

  return { ref: setNode, height }
}
