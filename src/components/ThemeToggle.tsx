import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
  expanded?: boolean
}

export function ThemeToggle({ theme, onToggle, expanded = false }: ThemeToggleProps) {
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  const Icon = theme === 'dark' ? Sun : Moon

  return (
    <button
      className={expanded ? 'icon-button theme-toggle theme-toggle--expanded' : 'icon-button theme-toggle'}
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
      {expanded ? <span>{label}</span> : null}
    </button>
  )
}
