import { expect, type Page } from '@playwright/test'

export const EMAIL = 'khaledhani.work@gmail.com'
export const GITHUB_URL = 'https://github.com/Defualt09'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/khaled-bin-taleb-6a9497371/'
export const MAILTO_URL =
  'mailto:khaledhani.work@gmail.com?subject=Internship%20Opportunity%20%E2%80%94%20Khaled%20Hani%20Bin%20Taleb'

export const REQUIRED_SECTION_IDS = [
  'top',
  'about',
  'skills',
  'projects',
  'labs',
  'forensics',
  'education',
  'certifications',
  'languages',
  'contact',
] as const

export async function openPortfolio(page: Page): Promise<void> {
  await page.goto('/')
  await expect(page).toHaveTitle('Khaled Hani Bin Taleb | IT Infrastructure & Networking')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Building reliable systems, one packet at a time\./,
    }),
  ).toBeVisible()
}

export function collectRuntimeIssues(page: Page): string[] {
  const issues: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      issues.push(`console.${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`))

  return issues
}

export async function clearStoredTheme(page: Page): Promise<void> {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.removeItem('kh-theme'))
}
