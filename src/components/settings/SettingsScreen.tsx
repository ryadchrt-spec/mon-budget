import { useState } from 'react'
import { ArrowLeft, Download, Moon, Sun, Monitor, ShieldCheck, Pencil } from 'lucide-react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { Modal } from '../ui/Modal'
import { CategoryForm, type CategoryFormValue } from './CategoryForm'
import {
  useAllCategories,
  useSettings,
  addCategory,
  updateCategory,
  archiveCategory,
  updateSettings,
} from '../../hooks/useBudgetData'
import { db } from '../../db/db'
import { exportTransactionsToCSV } from '../../utils/csv'
import type { Category, TransactionType } from '../../types'

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const categories = useAllCategories()
  const settings = useSettings()
  const [tab, setTab] = useState<TransactionType>('expense')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [creatingCategory, setCreatingCategory] = useState(false)

  const visible = (categories ?? []).filter((c) => c.type === tab && !c.archived)

  async function handleExport() {
    const all = await db.transactions.toArray()
    exportTransactionsToCSV(all, categories ?? [])
  }

  async function handleSave(value: CategoryFormValue) {
    if (editingCategory) {
      await updateCategory(editingCategory.id, value)
      setEditingCategory(null)
    } else {
      await addCategory(value)
      setCreatingCategory(false)
    }
  }

  async function handleDelete() {
    if (!editingCategory) return
    await archiveCategory(editingCategory.id)
    setEditingCategory(null)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-5 px-4 pb-16 pt-5 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour"
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </button>
        <h1 className="font-heading text-2xl font-bold text-[var(--color-ink)]">Réglages</h1>
      </div>

      <Card className="p-5">
        <h2 className="font-heading mb-1 text-lg font-semibold text-[var(--color-ink)]">Seuil d'alerte par défaut</h2>
        <p className="mb-3 text-sm text-[var(--color-ink-soft)]">
          Une catégorie s'allume en rouge quand elle dépasse ce pourcentage de tes revenus du mois (sauf si elle a un
          plafond personnalisé).
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={settings?.defaultAlertThreshold ?? 50}
            onChange={(e) => updateSettings({ defaultAlertThreshold: Number(e.target.value) })}
            className="h-2 flex-1 accent-[var(--color-primary)]"
          />
          <span className="font-heading w-16 shrink-0 text-right text-xl font-bold text-[var(--color-primary)]">
            {settings?.defaultAlertThreshold ?? 50}%
          </span>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-heading mb-3 text-lg font-semibold text-[var(--color-ink)]">Apparence</h2>
        <div className="flex gap-2.5">
          {(
            [
              { value: 'light', label: 'Clair', icon: Sun },
              { value: 'dark', label: 'Sombre', icon: Moon },
              { value: 'auto', label: 'Auto', icon: Monitor },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateSettings({ theme: value })}
              aria-pressed={settings?.theme === value}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl border-2 py-3 text-sm font-semibold transition-colors active:scale-95 ${
                settings?.theme === value
                  ? 'border-[var(--color-primary)] bg-[var(--color-surface-muted)] text-[var(--color-primary)]'
                  : 'border-transparent bg-[var(--color-surface-muted)] text-[var(--color-ink-soft)]'
              }`}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-[var(--color-ink)]">Catégories</h2>
          <button
            type="button"
            onClick={() => setCreatingCategory(true)}
            className="rounded-xl bg-[var(--color-surface-muted)] px-3.5 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-border)] active:scale-95"
          >
            + Ajouter
          </button>
        </div>

        <div className="mb-3 flex rounded-2xl bg-[var(--color-surface-muted)] p-1">
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-xl py-2 text-[15px] font-semibold transition-colors ${
                tab === t ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-soft)]' : 'text-[var(--color-ink-soft)]'
              }`}
            >
              {t === 'expense' ? 'Dépenses' : 'Revenus'}
            </button>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {visible.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setEditingCategory(cat)}
              className="flex items-center gap-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-muted)] active:scale-[0.99]"
            >
              <IconBadge icon={cat.icon} color={cat.color} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-medium text-[var(--color-ink)]">{cat.name}</div>
                {cat.monthlyLimit ? (
                  <div className="text-xs text-[var(--color-ink-soft)]">Plafond {cat.monthlyLimit} €</div>
                ) : null}
              </div>
              <Pencil size={16} className="shrink-0 text-[var(--color-ink-soft)]" aria-hidden="true" />
            </button>
          ))}
          {visible.length === 0 && (
            <p className="py-4 text-center text-[15px] text-[var(--color-ink-soft)]">Aucune catégorie pour l'instant.</p>
          )}
        </div>
      </Card>

      <Card className="flex items-center gap-4 p-5">
        <ShieldCheck size={28} className="shrink-0 text-[var(--color-income)]" aria-hidden="true" />
        <div className="flex-1">
          <h2 className="font-heading text-lg font-semibold text-[var(--color-ink)]">Tes données</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Tout reste enregistré sur cet appareil, rien n'est envoyé ailleurs. Tu peux exporter un fichier de secours
            à tout moment.
          </p>
        </div>
      </Card>

      <button
        type="button"
        onClick={handleExport}
        className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--color-primary)] text-lg font-bold text-[var(--color-primary)] transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
      >
        <Download size={22} aria-hidden="true" />
        Exporter mes données (CSV)
      </button>

      {(editingCategory || creatingCategory) && (
        <Modal
          title={editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          onClose={() => {
            setEditingCategory(null)
            setCreatingCategory(false)
          }}
        >
          <CategoryForm
            initial={editingCategory ?? undefined}
            defaultType={tab}
            onSubmit={handleSave}
            onDelete={editingCategory ? handleDelete : undefined}
          />
        </Modal>
      )}
    </div>
  )
}
