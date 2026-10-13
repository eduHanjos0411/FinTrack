import type { Category, FinanceState } from '../types'

/** Cores atribuídas em sequência às categorias criadas pelo usuário. */
export const CATEGORY_COLORS = [
  '#2f7de1',
  '#13a676',
  '#f0761a',
  '#d946a8',
  '#6366f1',
  '#8b5cf6',
  '#0ea5a4',
  '#e11d48',
  '#ca8a04',
  '#64748b',
]

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'transporte', name: 'Transporte', color: '#2f7de1' },
  { id: 'alimentacao', name: 'Alimentação', color: '#13a676' },
  { id: 'delivery', name: 'Delivery', color: '#f0761a' },
  { id: 'roupas', name: 'Roupas', color: '#d946a8' },
  { id: 'eletronicos', name: 'Eletrônicos', color: '#6366f1' },
  { id: 'jogos', name: 'Jogos', color: '#8b5cf6' },
]

export function createInitialState(): FinanceState {
  return { version: 1, categories: DEFAULT_CATEGORIES, months: {}, installments: [] }
}
