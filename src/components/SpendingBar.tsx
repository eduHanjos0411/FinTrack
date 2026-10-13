import type { Totals } from '../lib/finance'
import { formatBRL } from '../lib/money'
import { cssVar } from '../lib/style'
import type { Category } from '../types'

interface SpendingBarProps {
  categories: Category[]
  totals: Totals
}

interface Segment {
  key: string
  label: string
  color: string
  value: number
}

/** Como as entradas do mês foram usadas: gastos por categoria, investimentos e o que sobrou. */
export function SpendingBar({ categories, totals }: SpendingBarProps) {
  const segments: Segment[] = totals.byCategory
    .filter((entry) => entry.total > 0)
    .map(({ categoryId, total }) => {
      const category = categories.find((c) => c.id === categoryId)
      return {
        key: categoryId ?? 'none',
        label: category?.name ?? 'Sem categoria',
        color: category?.color ?? 'var(--text-muted)',
        value: total,
      }
    })
  if (totals.investments > 0) {
    segments.push({ key: 'investments', label: 'Investido', color: 'var(--accent-investment)', value: totals.investments })
  }

  const used = segments.reduce((total, segment) => total + segment.value, 0)
  const base = Math.max(totals.incomes, used)
  const free = totals.incomes - used

  if (base === 0) {
    return <p className="usage usage--empty">Lance entradas e gastos para ver para onde vai o dinheiro.</p>
  }

  return (
    <div className="usage">
      <div className="usage__bar" role="img" aria-label="Distribuição das entradas por categoria">
        {segments.map((segment) => (
          <span
            key={segment.key}
            className="usage__segment"
            style={{ ...cssVar('--chip', segment.color), width: `${(segment.value / base) * 100}%` }}
            title={`${segment.label}: ${formatBRL(segment.value)}`}
          />
        ))}
      </div>
      <ul className="usage__legend">
        {segments.map((segment) => (
          <li key={segment.key} style={cssVar('--chip', segment.color)}>
            <span className="chip__dot" />
            {segment.label} <strong>{formatBRL(segment.value)}</strong>
          </li>
        ))}
        {free > 0 && (
          <li className="usage__free">
            <span className="chip__dot" />
            Livre <strong>{formatBRL(free)}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}
