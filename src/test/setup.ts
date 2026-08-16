import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

function mediaQueryList(query: string, matches = false): MediaQueryList {
  return {
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  }
}

beforeEach(() => {
  document.body.className = ''
  document.documentElement.dataset.theme = 'dark'
  window.localStorage.clear()

  let themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!themeColor) {
    themeColor = document.createElement('meta')
    themeColor.name = 'theme-color'
    document.head.append(themeColor)
  }
  themeColor.content = '#080c12'

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => mediaQueryList(query)),
  })

  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: vi.fn<Clipboard['writeText']>().mockResolvedValue(undefined),
    },
  })

  Reflect.deleteProperty(window, 'IntersectionObserver')
  Reflect.deleteProperty(globalThis, 'IntersectionObserver')
})

afterEach(() => {
  cleanup()
  document.body.className = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
