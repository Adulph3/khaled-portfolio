import { Award } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { certifications } from '../data/portfolio'

export function CertificationsSection() {
  return (
    <section className="section section--certifications" id="certifications" aria-labelledby="certifications-title">
      <div className="container">
        <SectionHeading id="certifications-title" index="07" title="Certifications" />
        <ol className="certification-list" data-reveal>
          {certifications.map((certification) => (
            <li key={`${certification.issuer}-${certification.title}`}>
              <time dateTime={String(certification.year)}>{certification.year}</time>
              <Award aria-hidden="true" size={22} strokeWidth={1.6} />
              <div>
                <strong>{certification.issuer}</strong>
                <span>— {certification.title}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
