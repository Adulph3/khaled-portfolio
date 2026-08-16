interface ScrollProgressProps {
  value: number
}

export function ScrollProgress({ value }: ScrollProgressProps) {
  return (
    <progress
      className="scroll-progress"
      max="100"
      value={value}
      aria-label={`Page scroll progress: ${Math.round(value)}%`}
    />
  )
}
