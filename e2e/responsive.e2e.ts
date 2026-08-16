import { expect, test } from '@playwright/test'
import { EMAIL, openPortfolio } from './test-helpers'

const requiredViewports = [
  { width: 320, height: 720 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 900 },
] as const

for (const viewport of requiredViewports) {
  test(`has no page or critical-layout overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await openPortfolio(page)

    const layout = await page.evaluate(() => {
      const documentWidth = Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth,
      )
      const criticalElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          'main > section, main article, .network-diagram, .contact-panel, .site-footer__inner',
        ),
      )
      const offenders = criticalElements.flatMap((element) => {
        const rectangle = element.getBoundingClientRect()
        const outsideViewport = rectangle.left < -1 || rectangle.right > window.innerWidth + 1
        return outsideViewport
          ? [{
              className: element.className,
              left: rectangle.left,
              right: rectangle.right,
              tagName: element.tagName,
            }]
          : []
      })

      return { documentWidth, offenders, viewportWidth: window.innerWidth }
    })

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1)
    expect(layout.offenders).toEqual([])

    const usesMobileNavigation = viewport.width <= 960
    await expect(page.getByRole('button', { name: 'Open navigation menu' }))[
      usesMobileNavigation ? 'toBeVisible' : 'toBeHidden'
    ]()
    await expect(page.getByRole('navigation', { name: 'Primary navigation' }))[
      usesMobileNavigation ? 'toBeHidden' : 'toBeVisible'
    ]()

    const emailLink = page.getByRole('link', { name: EMAIL, exact: true })
    await emailLink.scrollIntoViewIfNeeded()
    const emailBox = await emailLink.boundingBox()
    expect(emailBox).not.toBeNull()
    expect(emailBox?.x).toBeGreaterThanOrEqual(-1)
    expect((emailBox?.x ?? 0) + (emailBox?.width ?? 0)).toBeLessThanOrEqual(viewport.width + 1)
  })
}

test('captures desktop dark/light and mobile drawer evidence in the test output', async ({
  browserName,
  page,
}, testInfo) => {
  test.skip(browserName !== 'chromium', 'One browser is sufficient for non-assertive screenshot evidence.')

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ colorScheme: 'dark' })
  await openPortfolio(page)
  await page.screenshot({ path: testInfo.outputPath('desktop-dark.png'), fullPage: false })

  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.screenshot({ path: testInfo.outputPath('desktop-light.png'), fullPage: false })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  const mobileDialog = page.getByRole('dialog', { name: 'Site navigation' })
  await mobileDialog.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await mobileDialog.getByRole('button', { name: 'Close navigation menu' }).click()
  await page.screenshot({ path: testInfo.outputPath('mobile-dark.png'), fullPage: false })

  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeVisible()
  await page.waitForTimeout(300)
  await page.screenshot({ path: testInfo.outputPath('mobile-menu.png'), fullPage: false })
})
