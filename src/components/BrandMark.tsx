import { publicAsset } from '../data/portfolio'

interface BrandMarkProps {
  compact?: boolean
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <a
      className={compact ? 'brand-mark brand-mark--compact' : 'brand-mark'}
      href="#top"
      aria-label="Khaled Hani Bin Taleb — back to top"
    >
      <img src={publicAsset('kh-monogram.png')} alt="" width="72" height="72" />
    </a>
  )
}
