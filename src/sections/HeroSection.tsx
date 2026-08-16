import {
  ArrowDownRight,
  Award,
  CalendarDays,
  Globe2,
  GraduationCap,
  Mail,
} from 'lucide-react'
import { githubUrl, heroHighlights, linkedinUrl, profile } from '../data/portfolio'
import { NetworkDiagram } from '../components/NetworkDiagram'
import { GitHubIcon, LinkedInIcon } from '../components/SocialIcons'

const highlightIcons = [GraduationCap, CalendarDays, Award, Globe2] as const

export function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__content" data-reveal>
          <p className="hero__label">IT Infrastructure <span>·</span> Networking <span>·</span> Security</p>
          <h1 id="hero-title">
            <span>Building reliable systems,</span>{' '}
            <span>one packet at a time.</span>
          </h1>
          <div className="hero__identity">
            <p>{profile.name}</p>
            <span>{profile.title}</span>
          </div>
          <p className="hero__summary">
            I’m Khaled Hani Bin Taleb, a Computer Science student focused on computer networking,
            Linux and Windows environments, server-client systems, and packet analysis. I use tools
            such as Wireshark to understand network traffic, troubleshoot connectivity, and
            investigate network behavior.
          </p>
          <p className="availability">
            <span aria-hidden="true" />
            Open to IT Infrastructure &amp; Networking internships
          </p>

          <div className="hero__primary-actions">
            <a className="button button--primary" href="#projects">
              Explore My Projects
              <ArrowDownRight aria-hidden="true" size={18} />
            </a>
            <a className="button" href="#contact">
              <Mail aria-hidden="true" size={18} />
              Contact Me
            </a>
          </div>

          <div className="hero__secondary-actions" aria-label="Profile links">
            <a
              className="button button--quiet"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon size={17} />
              GitHub
            </a>
            <a
              className="button button--quiet"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon size={17} />
              LinkedIn
            </a>
          </div>
        </div>

        <NetworkDiagram />
      </div>

      <div className="container hero-highlights" aria-label="Portfolio highlights" data-reveal>
        {heroHighlights.map((highlight, index) => {
          const Icon = highlightIcons[index] ?? CalendarDays
          return (
            <div className="hero-highlight" key={highlight.label}>
              <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
              <span>{highlight.label}</span>
              <strong>{highlight.value}</strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}
