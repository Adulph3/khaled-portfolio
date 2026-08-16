import { useEffect, useState } from 'react'

interface ScrollState {
  progress: number
  isScrolled: boolean
  showBackToTop: boolean
}

const initialState: ScrollState = { progress: 0, isScrolled: false, showBackToTop: false }

export function useScrollState(): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>(initialState)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const scrollTop = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? Math.min(100, Math.max(0, (scrollTop / total) * 100)) : 0
      setScrollState({
        progress,
        isScrolled: scrollTop > 24,
        showBackToTop: scrollTop > window.innerHeight * 0.8,
      })
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [])

  return scrollState
}
