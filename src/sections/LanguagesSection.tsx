import { Languages } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { languages } from '../data/portfolio'

export function LanguagesSection() {
  return (
    <section className="section section--languages" id="languages" aria-labelledby="languages-title">
      <div className="container">
        <SectionHeading id="languages-title" index="08" title="Languages" />
        <dl className="language-list" data-reveal>
          {languages.map((language) => (
            <div key={language.name}>
              <Languages aria-hidden="true" size={24} strokeWidth={1.6} />
              <dt>{language.name}</dt>
              <dd>{language.level}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
