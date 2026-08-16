import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { githubUrl, linkedinUrl, mailtoHref, profile } from './data/portfolio'

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = []

  readonly root = null
  readonly rootMargin: string
  readonly thresholds: readonly number[]
  readonly observe = vi.fn<(target: Element) => void>()
  readonly unobserve = vi.fn<(target: Element) => void>()
  readonly disconnect = vi.fn<() => void>()
  readonly takeRecords = vi.fn<() => IntersectionObserverEntry[]>(() => [])
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = callback
    this.rootMargin = options.rootMargin ?? '0px'
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0]
    IntersectionObserverMock.instances.push(this)
  }

  emit(target: Element, intersectionRatio = 1): void {
    const entry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio,
      intersectionRect: target.getBoundingClientRect(),
      isIntersecting: intersectionRatio > 0,
      rootBounds: null,
      target,
      time: performance.now(),
    } satisfies IntersectionObserverEntry

    this.callback([entry], this as unknown as IntersectionObserver)
  }
}

const requiredSections = [
  ['about', 'About'],
  ['skills', 'Technical Skills'],
  ['projects', 'Featured Projects'],
  ['labs', 'Hands-On Experience & Labs'],
  ['forensics', 'Capture The Flag — Network Forensics & Packet Analysis'],
  ['education', 'Education'],
  ['certifications', 'Certifications'],
  ['languages', 'Languages'],
  ['contact', 'Contact'],
] as const

function installIntersectionObserver(): void {
  IntersectionObserverMock.instances = []
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
}

function setReducedMotion(reduced: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: reduced && query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  }))
}

afterEach(() => {
  IntersectionObserverMock.instances = []
})

describe('portfolio content and navigation', () => {
  it('renders the complete single-page structure and source-of-truth content', () => {
    render(<App />)

    expect(document.querySelector('.site-header')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main-content',
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Building reliable systems, one packet at a time.',
    )

    for (const [id, heading] of requiredSections) {
      const section = document.getElementById(id)
      expect(section).toBeInstanceOf(HTMLElement)
      expect(section).toHaveAttribute('aria-labelledby', `${id}-title`)
      const sectionHeading = document.getElementById(`${id}-title`)
      expect(sectionHeading?.tagName).toBe('H2')
      expect(sectionHeading).toHaveTextContent(heading)
    }

    expect(screen.getAllByText(profile.name).length).toBeGreaterThan(0)
    expect(screen.getAllByText(profile.title).length).toBeGreaterThan(0)
    expect(screen.getByText('Server-Client Network Application')).toBeInTheDocument()
    expect(screen.getByText('Bank Management System')).toBeInTheDocument()
    expect(screen.getByText('University Management System')).toBeInTheDocument()
    expect(screen.getByText('Cisco')).toBeInTheDocument()
    expect(screen.getByText('FSEC-SS')).toBeInTheDocument()
    expect(screen.getByText('Arabic')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(document.querySelector('form')).not.toBeInTheDocument()
  })

  it('uses exact public profile and contact links without private downloads', () => {
    const { container } = render(<App />)

    const githubLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>(`a[href="${githubUrl}"]`),
    )
    const linkedinLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>(`a[href="${linkedinUrl}"]`),
    )

    expect(githubLinks.length).toBeGreaterThan(0)
    expect(linkedinLinks.length).toBeGreaterThan(0)
    for (const link of [...githubLinks, ...linkedinLinks]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    }

    expect(container.querySelector(`a[href="mailto:${profile.email}"]`)).toBeInTheDocument()
    expect(container.querySelector(`a[href="${mailtoHref}"]`)).toHaveTextContent('Open Email App')
    expect(container.querySelector('a[href^="tel:"]')).not.toBeInTheDocument()
    expect(container.querySelector('a[download]')).not.toBeInTheDocument()
    expect(screen.queryByText(/resume/i)).not.toBeInTheDocument()
  })

  it('updates the active navigation item from section intersections and cleans up observers', () => {
    installIntersectionObserver()
    const { unmount } = render(<App />)

    expect(IntersectionObserverMock.instances).toHaveLength(2)
    const activeSectionObserver = IntersectionObserverMock.instances[0]
    const revealObserver = IntersectionObserverMock.instances[1]
    expect(activeSectionObserver).toBeDefined()
    expect(revealObserver).toBeDefined()
    expect(activeSectionObserver?.observe).toHaveBeenCalledTimes(6)

    const projects = document.getElementById('projects')
    expect(projects).not.toBeNull()
    act(() => activeSectionObserver?.emit(projects as HTMLElement, 0.8))
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'location',
    )

    const revealTarget = document.querySelector<HTMLElement>('[data-reveal]')
    expect(revealTarget).not.toBeNull()
    act(() => revealObserver?.emit(revealTarget as HTMLElement))
    expect(revealTarget).toHaveClass('is-visible')
    expect(revealObserver?.unobserve).toHaveBeenCalledWith(revealTarget)

    unmount()
    expect(activeSectionObserver?.disconnect).toHaveBeenCalledOnce()
    expect(revealObserver?.disconnect).toHaveBeenCalledOnce()
  })
})

describe('contact actions', () => {
  it('copies the exact email and announces success through the live region', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Copy Email' }))

    expect(writeText).toHaveBeenCalledWith(profile.email)
    expect(screen.getByRole('status')).toHaveTextContent('Email copied to clipboard.')
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('announces a useful fallback when clipboard access is unavailable', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'))
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Copy Email' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      `Copy unavailable. Email address: ${profile.email}`,
    )
  })
})

describe('theme behavior', () => {
  it('toggles the document theme, theme color, label, and stored preference', async () => {
    const user = userEvent.setup()
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    render(<App />)

    const toggle = screen.getByRole('button', { name: 'Switch to light theme' })
    await user.click(toggle)

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#f4f1eb',
    )
    expect(setItem).toHaveBeenCalledWith('kh-theme', 'light')
    expect(toggle).toHaveAccessibleName('Switch to dark theme')
  })

  it('uses the theme already applied before React renders and remains usable without storage', async () => {
    const user = userEvent.setup()
    document.documentElement.dataset.theme = 'light'
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled')
    })
    render(<App />)

    const toggle = screen.getByRole('button', { name: 'Switch to dark theme' })
    await user.click(toggle)

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(toggle).toHaveAccessibleName('Switch to light theme')
  })
})

describe('accessible mobile navigation', () => {
  it('opens as a modal, locks the page, closes on Escape, and returns focus', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Open navigation menu' })

    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: 'Site navigation' })
    expect(dialog).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(document.body).toHaveClass('nav-open')
    expect(document.getElementById('main-content')).toHaveAttribute('aria-hidden', 'true')
    expect(within(dialog).getByRole('button', { name: 'Close navigation menu' })).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body).not.toHaveClass('nav-open')
    expect(document.getElementById('main-content')).not.toHaveAttribute('aria-hidden')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('closes after anchor selection and restores focus to the menu trigger', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Open navigation menu' })

    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Site navigation' })
    await user.click(within(dialog).getByRole('link', { name: 'About' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body).not.toHaveClass('nav-open')
    expect(trigger).toHaveFocus()
  })

  it('traps forward and reverse Tab focus inside the open menu', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }))

    const dialog = screen.getByRole('dialog', { name: 'Site navigation' })
    const first = within(dialog).getByRole('link', {
      name: 'Khaled Hani Bin Taleb — back to top',
    })
    const last = within(dialog).getByRole('button', { name: 'Switch to light theme' })

    first.focus()
    await user.tab({ shift: true })
    expect(last).toHaveFocus()

    await user.tab()
    expect(first).toHaveFocus()
  })

  it('closes from the close control and backdrop, and unlocks on unmount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    const trigger = screen.getByRole('button', { name: 'Open navigation menu' })
    await user.click(trigger)

    await user.click(screen.getByRole('button', { name: 'Close navigation menu' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body).not.toHaveClass('nav-open')

    await user.click(trigger)

    const backdrop = screen.getByRole('dialog').parentElement
    expect(backdrop).not.toBeNull()
    fireEvent.mouseDown(backdrop as HTMLElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body).not.toHaveClass('nav-open')

    await user.click(trigger)
    expect(document.body).toHaveClass('nav-open')
    unmount()
    expect(document.body).not.toHaveClass('nav-open')
  })
})

describe('motion and observer fallbacks', () => {
  it('reveals content immediately when reduced motion is requested', () => {
    installIntersectionObserver()
    setReducedMotion(true)
    render(<App />)

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    expect(revealElements.length).toBeGreaterThan(0)
    expect(revealElements.every((element) => element.classList.contains('is-visible'))).toBe(true)
    expect(IntersectionObserverMock.instances).toHaveLength(1)
  })

  it('reveals content without animation when IntersectionObserver is unavailable', async () => {
    setReducedMotion(false)
    render(<App />)

    await waitFor(() => {
      const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
      expect(revealElements.length).toBeGreaterThan(0)
      expect(revealElements.every((element) => element.classList.contains('is-visible'))).toBe(true)
    })
  })
})
