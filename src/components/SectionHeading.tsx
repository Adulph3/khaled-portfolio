interface SectionHeadingProps {
  id: string
  index: string
  title: string
  description?: string
}

export function SectionHeading({ id, index, title, description }: SectionHeadingProps) {
  return (
    <header className="section-heading" data-reveal>
      <div className="section-heading__rail" aria-hidden="true">
        <span>{index}</span>
      </div>
      <div>
        <h2 id={id}>{title}<span className="title-dot">.</span></h2>
        {description ? <p>{description}</p> : null}
      </div>
    </header>
  )
}
