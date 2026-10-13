import type { Totals } from '../lib/finance'
import { formatBRL } from '../lib/money'
import { addMonths, currentMonthKey, monthName, monthYear } from '../lib/months'
import type { Category, MonthKey } from '../types'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'
import { SpendingBar } from './SpendingBar'

interface HeroProps {
  month: MonthKey
  onMonthChange: (month: MonthKey) => void
  totals: Totals
  categories: Category[]
  copiedFrom: MonthKey | null
}

export function Hero({ month, onMonthChange, totals, categories, copiedFrom }: HeroProps) {
  const today = currentMonthKey()

  return (
    <header className="hero">
      <div className="hero__inner">
        <div className="hero__row">
          <span className="brand">FinTrack</span>
          <nav className="month-nav" aria-label="Mês">
            <button
              type="button"
              className="icon-button icon-button--light"
              aria-label="Mês anterior"
              onClick={() => onMonthChange(addMonths(month, -1))}
            >
              <ChevronLeftIcon />
            </button>
            <h1 className="month-nav__label">
              {monthName(month)} <span>{monthYear(month)}</span>
            </h1>
            <button
              type="button"
              className="icon-button icon-button--light"
              aria-label="Próximo mês"
              onClick={() => onMonthChange(addMonths(month, 1))}
            >
              <ChevronRightIcon />
            </button>
            {month !== today && (
              <button type="button" className="pill-button" onClick={() => onMonthChange(today)}>
                Hoje
              </button>
            )}
          </nav>
          {copiedFrom && (
            <span className="hero__note" title="Entradas, investimentos e despesas fixas foram copiados. Edite o que mudou.">
              Base: {monthName(copiedFrom)}
            </span>
          )}

          <dl className="stats">
            <div className="stat">
              <dt>Entradas</dt>
              <dd>{formatBRL(totals.incomes)}</dd>
            </div>
            <div className="stat">
              <dt>Total a pagar</dt>
              <dd>{formatBRL(totals.expenses)}</dd>
            </div>
            <div className="stat">
              <dt>Investido</dt>
              <dd>{formatBRL(totals.investments)}</dd>
            </div>
            <div className="stat stat--main">
              <dt>Sobra do mês</dt>
              <dd className={totals.balance < 0 ? 'is-negative' : ''}>{formatBRL(totals.balance)}</dd>
            </div>
          </dl>
        </div>

        <SpendingBar categories={categories} totals={totals} />
      </div>
    </header>
  )
}
