import { Activity, Filter, MonitorCheck, RadioTower, SearchCheck, ServerCog, Settings, Waypoints } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { labs } from '../data/portfolio'

const labIcons = [ServerCog, MonitorCheck, Filter, Activity, RadioTower, Settings, Waypoints, SearchCheck] as const

export function LabsSection() {
  return (
    <section className="section section--labs" id="labs" aria-labelledby="labs-title">
      <div className="container">
        <SectionHeading
          id="labs-title"
          index="04"
          title="Hands-On Experience & Labs"
          description="Academic & self-directed practice"
        />
        <ol className="lab-route">
          {labs.map((lab, index) => {
            const Icon = labIcons[index] ?? Activity
            const elapsedMinutes = index * 15
            const timestamp = `[${String(Math.floor(elapsedMinutes / 60)).padStart(2, '0')}:${String(elapsedMinutes % 60).padStart(2, '0')}]`
            return (
              <li key={lab.step} data-reveal>
                <div className="lab-route__index"><span>{lab.step}</span></div>
                <Icon aria-hidden="true" size={25} strokeWidth={1.6} />
                <code>{timestamp}</code>
                <h3>{lab.title}</h3>
                <p>{lab.detail}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
