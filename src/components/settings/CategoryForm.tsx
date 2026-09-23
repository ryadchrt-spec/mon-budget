import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { ICON_NAMES, CATEGORY_COLORS, getIcon } from '../../data/icons'
import type { Category, TransactionType } from '../../types'

export interface CategoryFormValue {
  name: string
  type: TransactionType
  icon: string
  color: string
  monthlyLimit?: number
  alertThreshold?: number
}

interface CategoryFormProps {
  initial?: Category
  defaultType?: TransactionType
  onSubmit: (value: CategoryFormValue) => void
  onDelete?: () => void
}

export function CategoryForm({ initial, defaultType = 'expense', onSubmit, onDelete }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<TransactionType>(initial?.type ?? defaultType)
  const [icon, setIcon] = useState(initial?.icon ?? 'MoreHorizontal')
  const [color, setColor] = useState(initial?.color ?? CATEGORY_COLORS[0])
  const [monthlyLimit, setMonthlyLimit] = useState(initial?.monthlyLimit ? String(initial.monthlyLimit) : '')
  const [alertThreshold, setAlertThreshold] = useState(
    initial?.alertThreshold !== undefined ? String(initial.alertThreshold) : '',
  )

  const canSubmit = name.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      type,
      icon,
      color,
      monthlyLimit: monthlyLimit ? Number(monthlyLimit.replace(',', '.')) : undefined,
      alertThreshold: alertThreshold ? Number(alertThreshold) : undefined,
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {!initial && (
        <div className="flex rounded-2xl bg-[var(--color-surface-muted)] p-1">
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 rounded-xl py-2.5 text-[15px] font-semibold transition-colors ${
                type === t ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-soft)]' : 'text-[var(--color-ink-soft)]'
              }`}
            >
              {t === 'expense' ? 'Dépense' : 'Revenu'}
            </button>
          ))}
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-[var(--color-ink-soft)]">Nom de la catégorie</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex : Coiffeur"
          className="h-13 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[17px] text-[var(--color-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-[var(--color-ink-soft)]">Couleur</span>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Choisir la couleur ${c}`}
              aria-pressed={color === c}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90"
              style={{ backgroundColor: c }}
            >
              {color === c && <Check size={18} className="text-white" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-[var(--color-ink-soft)]">Icône</span>
        <div className="scrollbar-soft grid max-h-48 grid-cols-6 gap-2 overflow-y-auto rounded-2xl bg-[var(--color-surface-muted)] p-2 sm:grid-cols-8">
          {ICON_NAMES.map((name_) => {
            const Icon = getIcon(name_)
            const selected = icon === name_
            return (
              <button
                key={name_}
                type="button"
                onClick={() => setIcon(name_)}
                aria-pressed={selected}
                aria-label={name_}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all active:scale-90 ${
                  selected ? 'shadow-[var(--shadow-soft)]' : 'hover:bg-white/60'
                }`}
                style={selected ? { backgroundColor: `${color}33`, color } : { color: 'var(--color-ink-soft)' }}
              >
                <Icon size={20} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </div>

      {type === 'expense' && (
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--color-ink-soft)]">Plafond mensuel (€)</span>
            <input
              type="text"
              inputMode="decimal"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="Optionnel"
              className="h-13 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[17px] text-[var(--color-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--color-ink-soft)]">Seuil d'alerte (%)</span>
            <input
              type="text"
              inputMode="numeric"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              placeholder="Par défaut"
              className="h-13 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[17px] text-[var(--color-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            />
          </label>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Supprimer la catégorie"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-danger-soft)] text-[var(--color-danger)] transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
          >
            <Trash2 size={22} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="h-14 flex-1 rounded-2xl bg-[var(--color-primary)] text-lg font-bold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}
