import { ArrowUp } from 'lucide-react'
import { profile } from '../data/portfolio'
import { BrandMark } from './BrandMark'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__identity">
          <BrandMark compact />
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.title}</span>
          </div>
        </div>
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <a href="#top">
          <ArrowUp aria-hidden="true" size={17} />
          Back to top
        </a>
      </div>
    </footer>
  )
}
