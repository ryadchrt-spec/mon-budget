import type { Category, Transaction } from '../types'

export function exportTransactionsToCSV(transactions: Transaction[], categories: Category[]) {
  const byId = new Map(categories.map((c) => [c.id, c]))
  const header = ['Date', 'Type', 'Catégorie', 'Nom', 'Montant (€)']
  const rows = transactions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => [
      new Date(t.date).toLocaleDateString('fr-FR'),
      t.type === 'income' ? 'Revenu' : 'Dépense',
      byId.get(t.categoryId)?.name ?? 'Autre',
      t.label,
      t.amount.toFixed(2).replace('.', ','),
    ])

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\r\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `mon-budget-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
