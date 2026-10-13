import type { ReactNode } from 'react'
import { formatBRL } from '../lib/money'
import { cssVar } from '../lib/style'
import { PlusIcon } from './Icons'

interface SectionProps {
  title: string
  description: string
  total: number
  /** Cor de destaque da seção (variável CSS). */
  accent: string
  addLabel: string
  emptyText: string
  isEmpty: boolean
  onAdd: () => void
  className?: string
  footer?: ReactNode
  children: ReactNode
}

export function Section({
  title,
  description,
  total,
  accent,
  addLabel,
  emptyText,
  isEmpty,
  onAdd,
  className = '',
  footer,
  children,
}: SectionProps) {
  return (
    <section className={`card section ${className}`} style={cssVar('--accent', accent)}>
      <header className="section__header">
        <div>
          <h2 className="section__title">{title}</h2>
          <p className="section__desc">{description}</p>
        </div>
        <span className="section__total">{formatBRL(total)}</span>
      </header>

      <div className="section__body">
        {isEmpty ? <p className="section__empty">{emptyText}</p> : <ul className="section__list">{children}</ul>}
      </div>

      <div className="section__footer">
        <button type="button" className="add-button" onClick={onAdd}>
          <PlusIcon size={16} />
          {addLabel}
        </button>
        {footer}
      </div>
    </section>
  )
}
