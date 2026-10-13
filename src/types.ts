/** Mês no formato `YYYY-MM`. Strings nesse formato ordenam cronologicamente. */
export type MonthKey = string

export type PaymentType = 'debit' | 'credit'

export interface Category {
  id: string
  name: string
  color: string
}

export interface Income {
  id: string
  description: string
  amount: number
}

export interface FixedExpense {
  id: string
  description: string
  categoryId: string | null
  amount: number
}

export interface MonthlyExpense {
  id: string
  description: string
  categoryId: string | null
  payment: PaymentType
  amount: number
}

/**
 * Parcelamentos vivem fora dos meses: a parcela de um mês é derivada de `start`,
 * então a compra aparece sozinha nos meses seguintes até acabar.
 */
export interface Installment {
  id: string
  description: string
  categoryId: string | null
  /** Valor de cada parcela. */
  amount: number
  total: number
  /** Mês da parcela 1. */
  start: MonthKey
}

export interface InstallmentView extends Installment {
  current: number
}

export interface MonthData {
  incomes: Income[]
  investments: Income[]
  fixed: FixedExpense[]
  monthly: MonthlyExpense[]
}

export type MonthListKey = keyof MonthData
export type MonthItem<K extends MonthListKey> = MonthData[K][number]

export interface FinanceState {
  version: 1
  categories: Category[]
  months: Record<MonthKey, MonthData>
  installments: Installment[]
}
