const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactCurrencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function formatEUR(amount: number, compact = false): string {
  return (compact ? compactCurrencyFormatter : currencyFormatter).format(amount)
}

export function formatSignedEUR(amount: number, type: 'income' | 'expense'): string {
  const sign = type === 'income' ? '+ ' : '- '
  return sign + currencyFormatter.format(Math.abs(amount))
}

const monthLabelFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const dayLabelFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })

export function monthLabel(year: number, month: number): string {
  const label = monthLabelFormatter.format(new Date(year, month, 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function dayLabel(isoDate: string): string {
  return dayLabelFormatter.format(new Date(isoDate))
}

export function isoDateNow(): string {
  return new Date().toISOString()
}

export function ymKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export function toDateInputValue(isoDate: string): string {
  const d = new Date(isoDate)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function fromDateInputValue(value: string): string {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d, 12).toISOString()
}
