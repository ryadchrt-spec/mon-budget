import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from './useReducedMotion'

export function useStaggerReveal(deps: unknown[], selector = '[data-anim-card]') {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return
    const targets = ref.current.querySelectorAll(selector)
    if (targets.length === 0) return
    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power1.out', clearProps: 'opacity,transform', overwrite: true },
    )
    // If the tab is backgrounded/throttled mid-animation, GSAP's rAF-driven ticker can stall for
    // a long time, leaving these cards at a frozen partial opacity. Force it to finish after a
    // generous timeout so content is never left looking blank indefinitely.
    const fallback = window.setTimeout(() => tween.progress(1), 1500)
    return () => {
      window.clearTimeout(fallback)
      tween.kill()
      gsap.set(targets, { clearProps: 'opacity,transform' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
