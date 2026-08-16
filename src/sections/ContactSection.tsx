import { useState } from 'react'
import { Check, Copy, Mail, MapPin } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { githubUrl, linkedinUrl, mailtoHref, profile } from '../data/portfolio'
import { GitHubIcon, LinkedInIcon } from '../components/SocialIcons'

export function ContactSection() {
  const [copyStatus, setCopyStatus] = useState('')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyStatus('Email copied to clipboard.')
    } catch {
      setCopyStatus(`Copy unavailable. Email address: ${profile.email}`)
    }
  }

  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading id="contact-title" index="09" title="Contact" />
        <div className="contact-panel" data-reveal>
          <div className="contact-panel__copy">
            <Mail aria-hidden="true" size={28} strokeWidth={1.5} />
            <h3>Let’s build reliable infrastructure together.</h3>
            <p>I’m currently open to IT Infrastructure, Networking, System Administration, and related internship opportunities.</p>
            <div className="contact-details">
              <a href={`mailto:${profile.email}`}><Mail aria-hidden="true" size={18} />{profile.email}</a>
              <span><MapPin aria-hidden="true" size={18} />{profile.location}</span>
              <span className="availability availability--compact"><i aria-hidden="true" />Open to opportunities</span>
            </div>
          </div>
          <div className="contact-actions">
            <button className="button" type="button" onClick={() => void copyEmail()}>
              {copyStatus.startsWith('Email copied')
                ? <Check aria-hidden="true" size={18} />
                : <Copy aria-hidden="true" size={18} />}
              Copy Email
            </button>
            <a className="button button--primary" href={mailtoHref}>
              <Mail aria-hidden="true" size={18} />Open Email App
            </a>
            <a className="button" href={githubUrl} target="_blank" rel="noopener noreferrer">
              <GitHubIcon size={18} />GitHub
            </a>
            <a className="button" href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon size={18} />LinkedIn
            </a>
          </div>
          <p className="sr-only" aria-live="polite" role="status">{copyStatus}</p>
        </div>
      </div>
    </section>
  )
}
