import { useCallback, useState } from 'react'

export type Theme = 'dark' | 'light'

const THEME_KEY = 'kh-theme'
const themeColors: Record<Theme, string> = {
  dark: '#080c12',
  light: '#f4f1eb',
}

function getInitialTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // The visual theme still works when storage is unavailable.
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
