import { expect, test } from '@playwright/test'
import { openPortfolio } from './test-helpers'

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openPortfolio(page)
})

test('opens accessibly, locks scrolling, traps focus, and restores focus on Escape', async ({ page }) => {
  const menuButton = page.getByRole('button', { name: 'Open navigation menu' })
  await menuButton.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Site navigation' })
  const closeButton = dialog.getByRole('button', { name: 'Close navigation menu' })
  const themeButton = dialog.getByRole('button', { name: /Switch to (light|dark) theme/ })
  await expect(dialog).toBeVisible()
  await expect(closeButton).toBeFocused()
  await expect(page.locator('body')).toHaveClass(/nav-open/)
  await expect(page.locator('main')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  await expect(dialog.getByRole('link', { name: /resume|cv/i })).toHaveCount(0)
  await expect(dialog.locator('a[download], a[href^="tel:"]')).toHaveCount(0)

  await themeButton.focus()
  await page.keyboard.press('Tab')
  const brandLink = dialog.getByRole('link', { name: /Khaled Hani Bin Taleb.*back to top/ })
  await expect(brandLink).toBeFocused()

  await brandLink.focus()
  await page.keyboard.press('Shift+Tab')
  await expect(themeButton).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(menuButton).toBeFocused()
  await expect(page.locator('body')).not.toHaveClass(/nav-open/)
  await expect(page.locator('main')).not.toHaveAttribute('aria-hidden', 'true')
})

test('closes after selecting a navigation link and reaches its section', async ({ page }) => {
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  const dialog = page.getByRole('dialog', { name: 'Site navigation' })
  await dialog.getByRole('link', { name: 'Skills', exact: true }).click()

  await expect(dialog).toHaveCount(0)
  await expect(page).toHaveURL(/#skills$/)
  await expect(page.locator('#skills')).toBeInViewport({ ratio: 0.1 })
})

test('provides at least 44 by 44 pixel mobile navigation targets at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  const menuButton = page.getByRole('button', { name: 'Open navigation menu' })
  await expect(menuButton).toBeVisible()
  const menuButtonBox = await menuButton.boundingBox()
  expect(menuButtonBox).not.toBeNull()
  expect(menuButtonBox?.width).toBeGreaterThanOrEqual(44)
  expect(menuButtonBox?.height).toBeGreaterThanOrEqual(44)

  await menuButton.click()
  const targets = page.getByRole('dialog', { name: 'Site navigation' }).locator('a[href], button')
  const boxes = await targets.evaluateAll((elements) =>
    elements.map((element) => {
      const rectangle = element.getBoundingClientRect()
      return { height: rectangle.height, width: rectangle.width }
    }),
  )

  expect(boxes.length).toBeGreaterThan(0)
  for (const box of boxes) {
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
})

test('exposes a visible keyboard focus indicator and a working skip link', async ({ page }) => {
  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Skip to main content' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeInViewport()

  const focusStyle = await skipLink.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth }
  })
  expect(focusStyle.outlineStyle).not.toBe('none')
  expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(2)

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main-content$/)
  await expect(page.locator('#main-content')).toBeFocused()
})

test('keeps the drawer usable in mobile landscape orientation', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 })
  await page.getByRole('button', { name: 'Open navigation menu' }).click()

  const dialog = page.getByRole('dialog', { name: 'Site navigation' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Close navigation menu' })).toBeInViewport()
  await dialog.getByRole('link', { name: 'Labs', exact: true }).click()
  await expect(dialog).toHaveCount(0)
  await expect(page).toHaveURL(/#labs$/)
})
