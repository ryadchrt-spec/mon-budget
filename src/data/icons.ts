import {
  Utensils, Home, Car, Gamepad2, HeartPulse, Repeat, ShoppingBag, Zap, MoreHorizontal,
  Wallet, PiggyBank, Gift, GraduationCap, PawPrint, Shield, Plane, Baby, Dumbbell,
  Coffee, Phone, Wifi, Fuel, Bus, ShoppingCart, Stethoscope, Scissors, Wrench,
  Banknote, TrendingUp, Briefcase, HandCoins, Music, Film, Book, Shirt, Droplet,
  Flame, Landmark, CreditCard, Receipt, Bike, Users, Heart, Sparkles, Umbrella,
  type LucideIcon,
} from 'lucide-react'

export const ICONS: Record<string, LucideIcon> = {
  Utensils, Home, Car, Gamepad2, HeartPulse, Repeat, ShoppingBag, Zap, MoreHorizontal,
  Wallet, PiggyBank, Gift, GraduationCap, PawPrint, Shield, Plane, Baby, Dumbbell,
  Coffee, Phone, Wifi, Fuel, Bus, ShoppingCart, Stethoscope, Scissors, Wrench,
  Banknote, TrendingUp, Briefcase, HandCoins, Music, Film, Book, Shirt, Droplet,
  Flame, Landmark, CreditCard, Receipt, Bike, Users, Heart, Sparkles, Umbrella,
}

export const ICON_NAMES = Object.keys(ICONS)

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? MoreHorizontal
}

export const CATEGORY_COLORS = [
  '#0369a1', '#16a34a', '#f97316', '#a855f7', '#e11d48', '#6366f1',
  '#ec4899', '#eab308', '#059669', '#0d9488', '#78716c', '#2563eb',
  '#d97706', '#7c3aed', '#0891b2', '#65a30d',
]
