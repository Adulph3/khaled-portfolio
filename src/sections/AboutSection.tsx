import { BriefcaseBusiness, Languages, MapPin, Network, Wrench } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'

const facts = [
  {
    label: 'Current focus',
    value: 'IT infrastructure, networking, Linux, Windows, and packet analysis',
    icon: Network,
  },
  {
    label: 'What I enjoy solving',
    value: 'Connectivity, system configuration, and packet-level problems',
    icon: Wrench,
  },
  {
    label: 'Internship objective',
    value: 'Apply and strengthen infrastructure and networking skills',
    icon: BriefcaseBusiness,
  },
  { label: 'Location', value: 'Riyadh, Saudi Arabia', icon: MapPin },
  { label: 'Languages', value: 'Arabic and English', icon: Languages },
] as const

export function AboutSection() {
  return (
    <section className="section section--about" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading id="about-title" index="01" title="About" />
        <div className="about-layout">
          <div className="about-copy" data-reveal>
            <p>
              I’m a Computer Science student expected to graduate in 2028. I have a strong foundation
              in computer networking and TCP/IP, with a working understanding of system and server
              administration developed through university coursework and hands-on labs.
            </p>
            <p>
              I’ve configured server-client environments across Linux and Windows, analyzed network
              traffic using Wireshark, worked across the TCP/IP stack, and troubleshot operating-system,
              configuration, and connectivity issues.
            </p>
            <p>
              I also participate in Capture The Flag challenges focused on packet analysis and network
              forensics. I’m seeking an IT Infrastructure or Networking internship where I can apply
              and strengthen these skills.
            </p>
          </div>
          <dl className="about-facts" data-reveal>
            {facts.map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <Icon aria-hidden="true" size={21} strokeWidth={1.7} />
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
