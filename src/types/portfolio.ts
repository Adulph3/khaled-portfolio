export type SectionId = 'about' | 'skills' | 'projects' | 'labs' | 'education' | 'contact'

export interface NavigationItem {
  id: SectionId
  label: string
}

export interface SocialLink {
  label: 'GitHub' | 'LinkedIn'
  href: string
}

export interface PersonalProfile {
  name: string
  title: string
  location: string
  email: string
  availability: string
  graduationYear: number
  socialLinks: readonly SocialLink[]
}

export interface Highlight {
  label: string
  value: string
}

export interface SkillCategory {
  title: string
  protocolLabel: string
  skills: readonly string[]
}

export interface Project {
  title: string
  description: string
  technologies: readonly string[]
  details: readonly string[]
  visual: 'network' | 'terminal' | 'desktop'
  featured?: boolean
}

export interface LabExperience {
  step: string
  title: string
  detail: string
}

export interface Education {
  degree: string
  institution: string
  location: string
  expectedGraduation: number
  coursework: readonly string[]
}

export interface Certification {
  issuer: string
  title: string
  year: number
  url?: string
}

export interface Language {
  name: string
  level: string
}
