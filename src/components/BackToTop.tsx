import { ArrowUp } from 'lucide-react'

interface BackToTopProps {
  visible: boolean
}

export function BackToTop({ visible }: BackToTopProps) {
  return (
    <a
      className={visible ? 'back-to-top is-visible' : 'back-to-top'}
      href="#top"
      aria-label="Back to top"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
    >
      <ArrowUp aria-hidden="true" size={18} />
      <span>Top</span>
    </a>
  )
}
