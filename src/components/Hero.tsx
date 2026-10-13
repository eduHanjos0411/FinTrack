import type { SyncStatus } from '../hooks/useCloudState'
import type { Totals } from '../lib/finance'
import { formatBRL } from '../lib/money'
import { addMonths, currentMonthKey, monthName, monthYear } from '../lib/months'
import type { Category, MonthKey } from '../types'
import { ChevronLeftIcon, ChevronRightIcon, LogOutIcon } from './Icons'
import { SpendingBar } from './SpendingBar'

interface HeroProps {
  month: MonthKey
  onMonthChange: (month: MonthKey) => void
  totals: Totals
  categories: Category[]
  copiedFrom: MonthKey | null
  email: string
  sync: SyncStatus
  onSignOut: () => void
}

const SYNC_LABELS: Record<SyncStatus, string> = {
  saved: 'Salvo',
  saving: 'Salvando…',
  error: 'Sem conexão, tentando de novo',
}

export function Hero({ month, onMonthChange, totals, categories, copiedFrom, email, sync, onSignOut }: HeroProps) {
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

          <div className="account">
            <span className={`sync sync--${sync}`} role="status">
              <span className="sync__dot" aria-hidden="true" />
              {SYNC_LABELS[sync]}
            </span>
            <button
              type="button"
              className="icon-button icon-button--light"
              aria-label={`Sair (${email})`}
              title={`Sair (${email})`}
              onClick={onSignOut}
            >
              <LogOutIcon />
            </button>
          </div>
        </div>

        <SpendingBar categories={categories} totals={totals} />
      </div>
    </header>
  )
}
