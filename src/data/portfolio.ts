import type {
  Certification,
  Education,
  Highlight,
  LabExperience,
  Language,
  NavigationItem,
  PersonalProfile,
  Project,
  SkillCategory,
} from '../types/portfolio'

export const navigation: readonly NavigationItem[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'labs', label: 'Labs' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export const githubUrl = 'https://github.com/Defualt09'
export const linkedinUrl = 'https://www.linkedin.com/in/khaled-bin-taleb-6a9497371/'

export const profile: PersonalProfile = {
  name: 'Khaled Hani Bin Taleb',
  title: 'IT Infrastructure & Networking | Computer Science Student',
  location: 'Riyadh, Saudi Arabia',
  email: 'khaledhani.work@gmail.com',
  availability:
    'Open to IT Infrastructure, Networking, System Administration, and related internship opportunities.',
  graduationYear: 2028,
  socialLinks: [
    { label: 'GitHub', href: githubUrl },
    { label: 'LinkedIn', href: linkedinUrl },
  ],
}

export const heroHighlights: readonly Highlight[] = [
  { label: 'Expected Graduation', value: '2028' },
  { label: 'Technical Projects', value: '3' },
  { label: 'Certifications', value: '2' },
  { label: 'Languages', value: 'Arabic and English' },
]

export const skills: readonly SkillCategory[] = [
  {
    title: 'Networking and protocols',
    protocolLabel: 'APPLICATION → TRANSPORT → NETWORK',
    skills: [
      'TCP/IP',
      'UDP',
      'DNS',
      'HTTP',
      'IP addressing',
      'Port binding',
      'Socket programming',
      'Firewall configuration',
    ],
  },
  {
    title: 'Network analysis',
    protocolLabel: 'CAPTURE / INSPECT',
    skills: [
      'Wireshark',
      'PCAP analysis',
      'Packet filtering',
      'Wireshark display filters',
      'Network forensics',
      'Protocol analysis',
      'Traffic analysis',
    ],
  },
  {
    title: 'Operating systems',
    protocolLabel: 'HOST',
    skills: ['Rocky Linux', 'Ubuntu', 'Windows'],
  },
  {
    title: 'Foundational system and server administration',
    protocolLabel: 'SYSTEM / SERVICE',
    skills: [
      'Server-client setup',
      'Basic Linux server configuration',
      'Service configuration',
      'Port configuration',
      'System troubleshooting',
      'Connectivity troubleshooting',
    ],
  },
  {
    title: 'Programming and scripting',
    protocolLabel: 'AUTOMATE',
    skills: ['Python', 'Java', 'Bash'],
  },
  {
    title: 'Core concepts',
    protocolLabel: 'FOUNDATION',
    skills: [
      'Object-oriented programming',
      'Network troubleshooting',
      'System administration fundamentals',
      'Structured problem solving',
    ],
  },
]

export const projects: readonly Project[] = [
  {
    title: 'Server-Client Network Application',
    description:
      'Designed and deployed a functional server-client application with Rocky Linux acting as the server and Ubuntu acting as the client. Both hosts communicated over a local network.',
    technologies: [
      'Rocky Linux',
      'Ubuntu',
      'Linux networking',
      'Wireshark',
      'Socket programming',
      'Firewall configuration',
    ],
    details: [
      'Configured socket programming and port binding',
      'Established inter-host communication',
      'Applied firewall rules to control access between the hosts',
      'Captured and validated live traffic with Wireshark',
      'Confirmed connectivity',
      'Inspected packet flow across the TCP/IP stack',
    ],
    visual: 'network',
    featured: true,
  },
  {
    title: 'Bank Management System',
    description:
      'Built a console application implementing account management, deposit and withdrawal logic, and input validation, with a focus on structured problem solving and clean, readable code.',
    technologies: ['Python'],
    details: [
      'Account management flow',
      'Deposit and withdrawal logic',
      'Input validation',
    ],
    visual: 'terminal',
  },
  {
    title: 'University Management System',
    description:
      'Developed a desktop GUI application using Java Swing and object-oriented programming principles. The application manages students, courses, and registration data through a structured interface.',
    technologies: ['Java', 'Swing'],
    details: [
      'Object-oriented structure',
      'Student and course management',
      'Registration data workflow',
    ],
    visual: 'desktop',
  },
]

export const labs: readonly LabExperience[] = [
  {
    step: '01',
    title: 'Systems practice',
    detail: 'Practiced system administration and troubleshooting across Rocky Linux, Ubuntu, and Windows.',
  },
  {
    step: '02',
    title: 'Environment setup',
    detail: 'Configured server-client environments.',
  },
  {
    step: '03',
    title: 'Traffic control',
    detail: 'Applied packet-filtering techniques.',
  },
  {
    step: '04',
    title: 'Activity analysis',
    detail: 'Analyzed suspicious network activity.',
  },
  {
    step: '05',
    title: 'Connectivity diagnosis',
    detail: 'Diagnosed connectivity problems.',
  },
  {
    step: '06',
    title: 'Configuration diagnosis',
    detail: 'Diagnosed configuration problems.',
  },
  {
    step: '07',
    title: 'Protocol inspection',
    detail: 'Inspected TCP, UDP, DNS, and HTTP traffic.',
  },
  {
    step: '08',
    title: 'Packet validation',
    detail: 'Used Wireshark to validate connectivity and analyze packet flow.',
  },
]

export const education: Education = {
  degree: 'Bachelor of Computer Science',
  institution: 'Asia Pacific University',
  location: 'Malaysia',
  expectedGraduation: 2028,
  coursework: [
    'Computer Networking',
    'Data Structures',
    'Computing Theory',
    'Cyber Security Fundamentals',
  ],
}

export const certifications: readonly Certification[] = [
  { issuer: 'Cisco', title: 'Introduction to Cybersecurity', year: 2025 },
  { issuer: 'FSEC-SS', title: 'Attack the Cloud: Introduction to AWS Security', year: 2025 },
]

export const languages: readonly Language[] = [
  { name: 'Arabic', level: 'Native' },
  { name: 'English', level: 'Fluent' },
]

export const mailtoHref =
  'mailto:khaledhani.work@gmail.com?subject=Internship%20Opportunity%20%E2%80%94%20Khaled%20Hani%20Bin%20Taleb'

export function publicAsset(fileName: string): string {
  return `${import.meta.env.BASE_URL}${fileName}`
}
