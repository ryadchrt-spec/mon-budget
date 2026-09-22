import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'exp-alimentation', type: 'expense', name: 'Alimentation', icon: 'Utensils', color: '#f97316', isDefault: true, order: 0 },
  { id: 'exp-logement', type: 'expense', name: 'Logement', icon: 'Home', color: '#0369a1', isDefault: true, order: 1 },
  { id: 'exp-transport', type: 'expense', name: 'Transport', icon: 'Car', color: '#64748b', isDefault: true, order: 2 },
  { id: 'exp-loisirs', type: 'expense', name: 'Loisirs', icon: 'Gamepad2', color: '#a855f7', isDefault: true, order: 3 },
  { id: 'exp-sante', type: 'expense', name: 'Santé', icon: 'HeartPulse', color: '#e11d48', isDefault: true, order: 4 },
  { id: 'exp-abonnements', type: 'expense', name: 'Abonnements', icon: 'Repeat', color: '#6366f1', isDefault: true, order: 5 },
  { id: 'exp-shopping', type: 'expense', name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', isDefault: true, order: 6 },
  { id: 'exp-factures', type: 'expense', name: 'Factures', icon: 'Zap', color: '#eab308', isDefault: true, order: 7 },
  { id: 'exp-autres', type: 'expense', name: 'Autres dépenses', icon: 'MoreHorizontal', color: '#78716c', isDefault: true, order: 8 },

  { id: 'inc-salaire', type: 'income', name: 'Salaire', icon: 'Wallet', color: '#16a34a', isDefault: true, order: 0 },
  { id: 'inc-cadeaux', type: 'income', name: 'Cadeaux reçus', icon: 'Gift', color: '#0d9488', isDefault: true, order: 1 },
  { id: 'inc-autres', type: 'income', name: 'Autres revenus', icon: 'PiggyBank', color: '#059669', isDefault: true, order: 2 },
]
