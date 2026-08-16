import { useRef } from 'react'
import { Menu } from 'lucide-react'
import { githubUrl, linkedinUrl, navigation } from '../data/portfolio'
import type { SectionId } from '../types/portfolio'
import type { Theme } from '../hooks/useTheme'
import { BrandMark } from './BrandMark'
import { MobileNav } from './MobileNav'
import { ThemeToggle } from './ThemeToggle'
import { GitHubIcon, LinkedInIcon } from './SocialIcons'

interface HeaderProps {
  activeSection: SectionId | ''
  isScrolled: boolean
  menuOpen: boolean
  theme: Theme
  onMenuOpen: () => void
  onMenuClose: () => void
  onToggleTheme: () => void
}

export function Header({
  activeSection,
  isScrolled,
  menuOpen,
  theme,
  onMenuOpen,
  onMenuClose,
  onToggleTheme,
}: HeaderProps) {
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <header className={isScrolled ? 'site-header is-scrolled' : 'site-header'}>
        <div className="site-header__inner container">
          <BrandMark compact />

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? 'location' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <a
              className="icon-button desktop-only"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Khaled’s GitHub profile"
            >
              <GitHubIcon size={19} />
            </a>
            <a
              className="icon-button desktop-only"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Khaled’s LinkedIn profile"
            >
              <LinkedInIcon size={19} />
            </a>
            <span className="desktop-only"><ThemeToggle theme={theme} onToggle={onToggleTheme} /></span>
            <button
              className="icon-button menu-button"
              ref={menuButtonRef}
              type="button"
              onClick={onMenuOpen}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu aria-hidden="true" size={23} />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-navigation">
        <MobileNav
          open={menuOpen}
          activeSection={activeSection}
          triggerRef={menuButtonRef}
          theme={theme}
          onClose={onMenuClose}
          onToggleTheme={onToggleTheme}
        />
      </div>
    </>
  )
}
