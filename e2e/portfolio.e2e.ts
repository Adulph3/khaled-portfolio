import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  MAILTO_URL,
  REQUIRED_SECTION_IDS,
  collectRuntimeIssues,
  openPortfolio,
} from './test-helpers'

test('renders the portfolio identity, landmarks, and every required section', async ({ page }) => {
  await openPortfolio(page)

  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  for (const sectionId of REQUIRED_SECTION_IDS) {
    await expect(page.locator(`section#${sectionId}`)).toHaveCount(1)
  }

  await expect(page.getByText('Khaled Hani Bin Taleb', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Riyadh, Saudi Arabia', { exact: true }).first()).toBeAttached()
  await expect(page.locator('#root')).not.toBeEmpty()
  await expect(page.locator('vite-error-overlay')).toHaveCount(0)
  await expect(page.getByText(/Internal Server Error|Failed to compile/i)).toHaveCount(0)
})

test('uses exact public contact and profile links without private downloads', async ({ page }) => {
  await openPortfolio(page)

  const githubLinks = page.locator(`a[href="${GITHUB_URL}"]`)
  const linkedinLinks = page.locator(`a[href="${LINKEDIN_URL}"]`)
  await expect(githubLinks).not.toHaveCount(0)
  await expect(linkedinLinks).not.toHaveCount(0)

  for (const links of [githubLinks, linkedinLinks]) {
    const attributes = await links.evaluateAll((elements) =>
      elements.map((element) => ({
        target: element.getAttribute('target'),
        rel: element.getAttribute('rel')?.split(/\s+/) ?? [],
      })),
    )

    for (const attributesForLink of attributes) {
      expect(attributesForLink.target).toBe('_blank')
      expect(attributesForLink.rel).toEqual(expect.arrayContaining(['noopener', 'noreferrer']))
    }
  }

  await expect(page.getByRole('link', { name: EMAIL, exact: true })).toHaveAttribute(
    'href',
    `mailto:${EMAIL}`,
  )
  await expect(page.getByRole('link', { name: 'Open Email App' })).toHaveAttribute(
    'href',
    MAILTO_URL,
  )
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0)
  await expect(page.locator('a[download]')).toHaveCount(0)
  await expect(page.getByText(/resume/i)).toHaveCount(0)
})

test('copies the exact email and announces success accessibly', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (value: string) => {
          window.sessionStorage.setItem('e2e-copied-text', value)
          return Promise.resolve()
        },
      },
    })
  })
  await openPortfolio(page)

  await page.getByRole('button', { name: 'Copy Email' }).click()
  await expect(page.getByRole('status')).toHaveText('Email copied to clipboard.')
  await expect
    .poll(() => page.evaluate(() => window.sessionStorage.getItem('e2e-copied-text')))
    .toBe(EMAIL)
})

test('navigates to an anchored section and updates the active navigation state', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await openPortfolio(page)

  const primaryNavigation = page.getByRole('navigation', { name: 'Primary navigation' })
  const projectsLink = primaryNavigation.getByRole('link', { name: 'Projects' })
  await projectsLink.click()

  await expect(page).toHaveURL(/#projects$/)
  await expect(page.locator('#projects')).toBeInViewport({ ratio: 0.15 })
  await expect(projectsLink).toHaveAttribute('aria-current', 'location')
})

test('has no positive tabindex values and passes automated WCAG checks', async ({ page }) => {
  await openPortfolio(page)

  const positiveTabIndexes = await page.locator('[tabindex]').evaluateAll((elements) =>
    elements
      .map((element) => element.getAttribute('tabindex'))
      .filter((value) => value !== null && Number(value) > 0),
  )
  expect(positiveTabIndexes).toEqual([])

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const violationSummary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => node.target),
  }))
  expect(violationSummary, JSON.stringify(violationSummary, null, 2)).toEqual([])
})

test('loads and exercises core controls without console warnings or runtime errors', async ({ page }) => {
  const runtimeIssues = collectRuntimeIssues(page)
  await openPortfolio(page)

  await page.getByRole('button', { name: /Switch to (light|dark) theme/ }).click()
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(page.locator('#contact')).toBeInViewport()
  await page.waitForTimeout(100)

  expect(runtimeIssues).toEqual([])
})
