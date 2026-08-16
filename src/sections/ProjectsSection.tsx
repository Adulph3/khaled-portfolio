import { Check, ChevronRight, Landmark, MonitorCog, Network, Server, Terminal } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { githubUrl, projects } from '../data/portfolio'
import type { Project } from '../types/portfolio'
import { GitHubIcon } from '../components/SocialIcons'

function NetworkProjectVisual() {
  return (
    <div className="project-network" aria-hidden="true">
      <div><MonitorCog size={28} /><span>Ubuntu Client</span></div>
      <span className="project-network__flow"><i /><i /><i /><ChevronRight size={20} /></span>
      <div><Network size={28} /><span>Local Network</span></div>
      <span className="project-network__flow"><i /><i /><i /><ChevronRight size={20} /></span>
      <div><Server size={28} /><span>Rocky Linux Server</span></div>
    </div>
  )
}

function SupportingProjectVisual({ project }: { project: Project }) {
  if (project.visual === 'terminal') {
    return (
      <div className="mini-terminal" aria-hidden="true">
        <code>$ python bank_management.py</code>
        <span>01 · Account management</span>
        <span>02 · Deposit / withdrawal</span>
        <span>03 · Input validation</span>
        <code className="terminal-prompt">status: ready</code>
      </div>
    )
  }

  return (
    <div className="mini-window" aria-hidden="true">
      <div className="mini-window__bar"><i /><i /><i /></div>
      <div className="mini-window__body">
        <span>Students</span><b>Structured records</b>
        <span>Courses</span><b>Course data</b>
        <span>Registration</span><b>Managed workflow</b>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const featured = projects[0]
  const supporting = projects.slice(1)
  if (!featured) return null

  return (
    <section className="section section--projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading id="projects-title" index="03" title="Featured Projects" />
        <div className="projects-layout">
          <article className="project-featured" data-reveal>
            <div className="project-title-row">
              <Terminal aria-hidden="true" size={28} strokeWidth={1.6} />
              <div>
                <code>PROJECT / NETWORKING</code>
                <h3>{featured.title}</h3>
              </div>
            </div>
            <p>{featured.description}</p>
            <ul className="tag-list" aria-label="Technologies">
              {featured.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
            <NetworkProjectVisual />
            <div className="project-details">
              <h4>Key implementation work</h4>
              <ul>
                {featured.details.map((detail) => (
                  <li key={detail}><Check aria-hidden="true" size={16} />{detail}</li>
                ))}
              </ul>
            </div>
          </article>

          <div className="supporting-projects">
            {supporting.map((project) => (
              <article className="supporting-project" key={project.title} data-reveal>
                <div className="project-title-row">
                  {project.visual === 'terminal'
                    ? <Landmark aria-hidden="true" size={24} strokeWidth={1.6} />
                    : <MonitorCog aria-hidden="true" size={24} strokeWidth={1.6} />}
                  <div>
                    <code>PROJECT / {project.technologies.join(' + ').toUpperCase()}</code>
                    <h3>{project.title}</h3>
                  </div>
                </div>
                <p>{project.description}</p>
                <SupportingProjectVisual project={project} />
                <ul className="tag-list" aria-label={`${project.title} technologies`}>
                  {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
              </article>
            ))}
            <a
              className="github-profile-cta"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon size={20} />
              View GitHub Profile
              <span>General profile</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
