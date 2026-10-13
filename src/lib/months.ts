import type { MonthKey } from '../types'

function parse(key: MonthKey): [year: number, month: number] {
  const [year, month] = key.split('-').map(Number)
  return [year, month]
}

function toKey(year: number, month: number): MonthKey {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function currentMonthKey(date = new Date()): MonthKey {
  return toKey(date.getFullYear(), date.getMonth() + 1)
}

export function addMonths(key: MonthKey, delta: number): MonthKey {
  const [year, month] = parse(key)
  const index = year * 12 + (month - 1) + delta
  return toKey(Math.floor(index / 12), (index % 12) + 1)
}

/** Quantos meses há de `from` até `to` (negativo se `to` vier antes). */
export function monthDiff(from: MonthKey, to: MonthKey): number {
  const [fy, fm] = parse(from)
  const [ty, tm] = parse(to)
  return (ty - fy) * 12 + (tm - fm)
}

export function monthName(key: MonthKey): string {
  const [year, month] = parse(key)
  const name = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long' })
  return name.charAt(0).toLocaleUpperCase('pt-BR') + name.slice(1)
}

export function monthYear(key: MonthKey): number {
  return parse(key)[0]
}
