import type { Installment, InstallmentView, MonthData, MonthKey } from '../types'
import { monthDiff } from './months'

export function emptyMonth(): MonthData {
  return { incomes: [], investments: [], fixed: [], monthly: [] }
}

export function previousStoredMonth(months: Record<MonthKey, MonthData>, key: MonthKey): MonthKey | null {
  let best: MonthKey | null = null
  for (const candidate of Object.keys(months)) {
    if (candidate < key && (best === null || candidate > best)) best = candidate
  }
  return best
}

/**
 * Dados de um mês. Um mês ainda não salvo herda entradas, investimentos e
 * despesas fixas do último mês salvo antes dele (gastos mensais começam vazios).
 * Os itens herdados mantêm os mesmos ids, então editar um deles na tela já
 * materializa o mês com ids consistentes.
 */
export function resolveMonth(months: Record<MonthKey, MonthData>, key: MonthKey): MonthData {
  const stored = months[key]
  if (stored) return stored
  const previous = previousStoredMonth(months, key)
  if (!previous) return emptyMonth()
  const source = months[previous]
  return { incomes: source.incomes, investments: source.investments, fixed: source.fixed, monthly: [] }
}

export function activeInstallments(installments: Installment[], key: MonthKey): InstallmentView[] {
  return installments
    .map((installment) => ({ ...installment, current: monthDiff(installment.start, key) + 1 }))
    .filter((installment) => installment.current >= 1 && installment.current <= installment.total)
}

export interface CategoryTotal {
  categoryId: string | null
  total: number
}

export interface Totals {
  incomes: number
  investments: number
  fixed: number
  installments: number
  monthly: number
  debit: number
  credit: number
  /** Fixos + parcelas + mensais: o "total a pagar" da planilha. */
  expenses: number
  /** Entradas − gastos − investimentos. */
  balance: number
  byCategory: CategoryTotal[]
}

function sum(items: { amount: number }[]): number {
  return items.reduce((total, item) => total + item.amount, 0)
}

export function computeTotals(month: MonthData, installments: InstallmentView[]): Totals {
  const incomes = sum(month.incomes)
  const investments = sum(month.investments)
  const fixed = sum(month.fixed)
  const installmentsTotal = sum(installments)
  const monthly = sum(month.monthly)
  const debit = sum(month.monthly.filter((item) => item.payment === 'debit'))
  const expenses = fixed + installmentsTotal + monthly

  const perCategory = new Map<string | null, number>()
  for (const item of [...month.fixed, ...installments, ...month.monthly]) {
    perCategory.set(item.categoryId, (perCategory.get(item.categoryId) ?? 0) + item.amount)
  }
  const byCategory = [...perCategory]
    .map(([categoryId, total]) => ({ categoryId, total }))
    .filter((entry) => entry.total !== 0)
    .sort((a, b) => b.total - a.total)

  return {
    incomes,
    investments,
    fixed,
    installments: installmentsTotal,
    monthly,
    debit,
    credit: monthly - debit,
    expenses,
    balance: incomes - expenses - investments,
    byCategory,
  }
}
