import { useEffect, useState } from 'react'
import type { NavigationItem, SectionId } from '../types/portfolio'

export function useActiveSection(items: readonly NavigationItem[]): SectionId | '' {
  const [activeSection, setActiveSection] = useState<SectionId | ''>('')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) setActiveSection(visible.target.id as SectionId)
      },
      { rootMargin: '-24% 0px -62% 0px', threshold: [0, 0.15, 0.35, 0.6] },
    )

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null)

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  return activeSection
}
