import { useEffect, useMemo, useState } from 'react'
import { createInitialState, CATEGORY_COLORS } from '../lib/defaults'
import { activeInstallments, computeTotals, previousStoredMonth, resolveMonth } from '../lib/finance'
import { createId } from '../lib/id'
import { addMonths, currentMonthKey } from '../lib/months'
import type { FinanceState, Installment, MonthData, MonthItem, MonthListKey } from '../types'

const STORAGE_KEY = 'fintrack:v1'

function loadState(): FinanceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as FinanceState
      if (parsed.version === 1) return parsed
    }
  } catch {
    // storage indisponível ou JSON corrompido: começa do zero
  }
  return createInitialState()
}

/** Estado global do app, persistido no localStorage. */
export function useFinance() {
  const [state, setState] = useState(loadState)
  const [month, setMonth] = useState(() => currentMonthKey())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // sem persistência (aba privada, cota cheia): o app segue funcionando em memória
    }
  }, [state])

  const data = useMemo(() => resolveMonth(state.months, month), [state.months, month])
  const installments = useMemo(() => activeInstallments(state.installments, month), [state.installments, month])
  const totals = useMemo(() => computeTotals(data, installments), [data, installments])
  const copiedFrom = state.months[month] ? null : previousStoredMonth(state.months, month)

  function updateMonth(update: (data: MonthData) => MonthData) {
    setState((s) => ({ ...s, months: { ...s.months, [month]: update(resolveMonth(s.months, month)) } }))
  }

  function addItem<K extends MonthListKey>(list: K, item: MonthItem<K>) {
    updateMonth((d) => ({ ...d, [list]: [...d[list], item] }))
  }

  function updateItem<K extends MonthListKey>(list: K, id: string, patch: Partial<MonthItem<K>>) {
    updateMonth((d) => ({
      ...d,
      [list]: (d[list] as MonthItem<K>[]).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  function removeItem(list: MonthListKey, id: string) {
    updateMonth((d) => ({ ...d, [list]: d[list].filter((item) => item.id !== id) }))
  }

  function addInstallment(installment: Installment) {
    setState((s) => ({ ...s, installments: [...s.installments, installment] }))
  }

  function updateInstallment(id: string, patch: Partial<Installment>) {
    setState((s) => ({
      ...s,
      installments: s.installments.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  /** Muda qual parcela cai no mês aberto, deslocando o mês de início. */
  function setInstallmentCurrent(id: string, current: number) {
    updateInstallment(id, { start: addMonths(month, 1 - current) })
  }

  function removeInstallment(id: string) {
    setState((s) => ({ ...s, installments: s.installments.filter((item) => item.id !== id) }))
  }

  /** Cria uma categoria (ou reaproveita uma de mesmo nome) e devolve seu id. */
  function addCategory(name: string): string {
    const normalized = name.toLocaleLowerCase('pt-BR')
    const existing = state.categories.find((c) => c.name.toLocaleLowerCase('pt-BR') === normalized)
    if (existing) return existing.id
    const category = {
      id: createId(),
      name,
      color: CATEGORY_COLORS[state.categories.length % CATEGORY_COLORS.length],
    }
    setState((s) => ({ ...s, categories: [...s.categories, category] }))
    return category.id
  }

  return {
    month,
    setMonth,
    categories: state.categories,
    data,
    installments,
    totals,
    copiedFrom,
    addItem,
    updateItem,
    removeItem,
    addInstallment,
    updateInstallment,
    setInstallmentCurrent,
    removeInstallment,
    addCategory,
  }
}
