import { BookOpen, GraduationCap, MapPin } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { education } from '../data/portfolio'

export function EducationSection() {
  return (
    <section className="section section--education" id="education" aria-labelledby="education-title">
      <div className="container">
        <SectionHeading id="education-title" index="06" title="Education" />
        <div className="education-layout" data-reveal>
          <div className="education-year">
            <GraduationCap aria-hidden="true" size={26} strokeWidth={1.6} />
            <strong>{education.expectedGraduation}</strong>
            <span>Expected graduation</span>
          </div>
          <div className="education-main">
            <code>BACHELOR / COMPUTER SCIENCE</code>
            <h3>{education.degree}</h3>
            <p><MapPin aria-hidden="true" size={17} />{education.institution}, {education.location}</p>
          </div>
          <div className="coursework">
            <BookOpen aria-hidden="true" size={23} strokeWidth={1.6} />
            <div>
              <h3>Relevant coursework</h3>
              <ul>{education.coursework.map((course) => <li key={course}>{course}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
