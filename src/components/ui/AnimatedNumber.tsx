import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface AnimatedNumberProps {
  value: number
  formatter: (n: number) => string
  className?: string
  duration?: number
}

export function AnimatedNumber({ value, formatter, className, duration = 1.4 }: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const stateRef = useRef({ val: 0 })
  const mountedRef = useRef(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const span = spanRef.current
    if (!span) return

    if (reducedMotion) {
      stateRef.current.val = value
      span.textContent = formatter(value)
      return
    }

    const from = mountedRef.current ? stateRef.current.val : 0
    mountedRef.current = true
    const obj = { val: from }
    stateRef.current = obj

    const tween = gsap.to(obj, {
      val: value,
      duration,
      ease: 'power1.out',
      onUpdate: () => {
        span.textContent = formatter(obj.val)
      },
    })
    return () => {
      tween.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, formatter])

  return (
    <span ref={spanRef} className={className}>
      {formatter(value)}
    </span>
  )
}
