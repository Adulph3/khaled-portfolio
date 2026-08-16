import { Binary, Braces, Network, ScanSearch, ServerCog, Waypoints } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { skills } from '../data/portfolio'

const skillIcons = [Waypoints, ScanSearch, Binary, ServerCog, Braces, Network] as const

export function SkillsSection() {
  return (
    <section className="section section--skills" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          id="skills-title"
          index="02"
          title="Technical Skills"
          description="Infrastructure knowledge. Protocol fluency. Practical problem solving."
        />
        <div className="protocol-map" aria-hidden="true">
          <span>APPLICATION</span><i /><span>TRANSPORT</span><i /><span>NETWORK</span><i /><span>SYSTEM</span>
        </div>
        <div className="skills-layout">
          {skills.map((category, index) => {
            const Icon = skillIcons[index] ?? Network
            return (
              <article className="skill-group" key={category.title} data-reveal>
                <header>
                  <Icon aria-hidden="true" size={23} strokeWidth={1.65} />
                  <div>
                    <code>{category.protocolLabel}</code>
                    <h3>{category.title}</h3>
                  </div>
                </header>
                <ul>
                  {category.skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
