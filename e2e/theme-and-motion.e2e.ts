import { clearStoredTheme, openPortfolio } from './test-helpers'
import { expect, test } from '@playwright/test'

test('uses the first-time system theme, toggles it, and persists the choice', async ({ page }) => {
  await clearStoredTheme(page)
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()

  const root = page.locator('html')
  await expect(root).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#080c12')

  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await expect(root).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f4f1eb')
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('kh-theme'))).toBe('light')

  await page.reload()
  await expect(root).toHaveAttribute('data-theme', 'light')
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible()
})

test('honors a first-time light system preference', async ({ page }) => {
  await clearStoredTheme(page)
  await page.emulateMedia({ colorScheme: 'light' })
  await page.reload()

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f4f1eb')
})

test('removes meaningful animation and smooth scrolling for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openPortfolio(page)

  const motionStyles = await page.locator('[data-reveal]').first().evaluate((element) => {
    const milliseconds = (cssTime: string): number => {
      const value = Number.parseFloat(cssTime)
      return cssTime.trim().endsWith('ms') ? value : value * 1_000
    }
    const style = window.getComputedStyle(element)
    const transitionMilliseconds = style.transitionDuration
      .split(',')
      .map(milliseconds)
    const animationMilliseconds = style.animationDuration
      .split(',')
      .map(milliseconds)

    return {
      maxAnimationMilliseconds: Math.max(...animationMilliseconds),
      maxTransitionMilliseconds: Math.max(...transitionMilliseconds),
      transform: style.transform,
      scrollBehavior: window.getComputedStyle(document.documentElement).scrollBehavior,
    }
  })

  expect(motionStyles.maxAnimationMilliseconds).toBeLessThanOrEqual(0.1)
  expect(motionStyles.maxTransitionMilliseconds).toBeLessThanOrEqual(0.1)
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(motionStyles.transform)
  expect(motionStyles.scrollBehavior).toBe('auto')
})
