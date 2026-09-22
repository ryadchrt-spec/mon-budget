import { getIcon } from '../../data/icons'

interface IconBadgeProps {
  icon: string
  color: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZE_MAP = {
  sm: { box: 'h-9 w-9', icon: 16 },
  md: { box: 'h-12 w-12', icon: 22 },
  lg: { box: 'h-16 w-16', icon: 28 },
  xl: { box: 'h-20 w-20', icon: 34 },
}

export function IconBadge({ icon, color, size = 'md' }: IconBadgeProps) {
  const Icon = getIcon(icon)
  const { box, icon: iconSize } = SIZE_MAP[size]
  return (
    <div
      className={`${box} flex shrink-0 items-center justify-center rounded-2xl`}
      style={{ backgroundColor: `${color}1f`, color }}
    >
      <Icon size={iconSize} strokeWidth={2.25} aria-hidden="true" />
    </div>
  )
}
