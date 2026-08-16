import { useCallback, useState } from 'react'
import { BackToTop } from './components/BackToTop'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ScrollProgress } from './components/ScrollProgress'
import { navigation } from './data/portfolio'
import { useActiveSection } from './hooks/useActiveSection'
import { useScrollState } from './hooks/useScrollState'
import { useSectionReveal } from './hooks/useSectionReveal'
import { useTheme } from './hooks/useTheme'
import { AboutSection } from './sections/AboutSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { ContactSection } from './sections/ContactSection'
import { EducationSection } from './sections/EducationSection'
import { ForensicsSection } from './sections/ForensicsSection'
import { HeroSection } from './sections/HeroSection'
import { LabsSection } from './sections/LabsSection'
import { LanguagesSection } from './sections/LanguagesSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { SkillsSection } from './sections/SkillsSection'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const activeSection = useActiveSection(navigation)
  const { progress, isScrolled, showBackToTop } = useScrollState()
  useSectionReveal()

  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <ScrollProgress value={progress} />
      <Header
        activeSection={activeSection}
        isScrolled={isScrolled}
        menuOpen={menuOpen}
        theme={theme}
        onMenuOpen={openMenu}
        onMenuClose={closeMenu}
        onToggleTheme={toggleTheme}
      />
      <main id="main-content" tabIndex={-1} aria-hidden={menuOpen ? true : undefined}>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <LabsSection />
        <ForensicsSection />
        <EducationSection />
        <CertificationsSection />
        <LanguagesSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop visible={showBackToTop} />
    </>
  )
}
