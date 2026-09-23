import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  className?: string
  as?: 'div' | 'section'
}

export function Card({ children, className = '', as = 'div', ...rest }: CardProps) {
  const Tag = as
  return (
    <Tag
      className={`rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
