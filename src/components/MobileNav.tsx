import { useEffect, useRef, type RefObject } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  FlaskConical,
  GraduationCap,
  Mail,
  UserRound,
  X,
} from 'lucide-react'
import { githubUrl, linkedinUrl, navigation } from '../data/portfolio'
import type { SectionId } from '../types/portfolio'
import type { Theme } from '../hooks/useTheme'
import { BrandMark } from './BrandMark'
import { ThemeToggle } from './ThemeToggle'
import { GitHubIcon, LinkedInIcon } from './SocialIcons'

interface MobileNavProps {
  open: boolean
  activeSection: SectionId | ''
  triggerRef: RefObject<HTMLButtonElement | null>
  theme: Theme
  onClose: () => void
  onToggleTheme: () => void
}

const navIcons = {
  about: UserRound,
  skills: Code2,
  projects: BriefcaseBusiness,
  labs: FlaskConical,
  education: GraduationCap,
  contact: Mail,
} as const

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function MobileNav({
  open,
  activeSection,
  triggerRef,
  theme,
  onClose,
  onToggleTheme,
}: MobileNavProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const trigger = triggerRef.current
    document.body.classList.add('nav-open')
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      )
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('nav-open')
      trigger?.focus()
    }
  }, [onClose, open, triggerRef])

  if (!open) return null

  return (
    <div className="mobile-nav-backdrop" onMouseDown={onClose}>
      <div
        className="mobile-nav"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mobile-nav__header">
          <BrandMark compact />
          <h2 className="sr-only" id="mobile-nav-title">Site navigation</h2>
          <button
            className="icon-button mobile-nav__close"
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X aria-hidden="true" size={24} />
          </button>
        </div>

        <nav className="mobile-nav__links" aria-label="Mobile navigation">
          {navigation.map((item) => {
            const Icon = navIcons[item.id]
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={onClose}
                aria-current={isActive ? 'location' : undefined}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
                <span>{item.label}</span>
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            )
          })}
        </nav>

        <div className="mobile-nav__actions">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <GitHubIcon size={20} />
            GitHub
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon size={20} />
            LinkedIn
          </a>
        </div>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} expanded />
      </div>
    </div>
  )
}
