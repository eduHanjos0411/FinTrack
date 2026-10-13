import { createInitialState } from './defaults'
import { supabase } from './supabase'
import type { FinanceState } from '../types'

const TABLE = 'finance_states'

/** Chave do app antes das contas; lida uma vez para importar os dados para a nuvem. */
const LEGACY_STORAGE_KEY = 'fintrack:v1'

/** Valida (e futuramente migra) o JSON salvo. Mudanças de formato incrementam `version`. */
function parseState(raw: unknown): FinanceState | null {
  if (raw && typeof raw === 'object' && (raw as FinanceState).version === 1) return raw as FinanceState
  return null
}

/** Estado salvo do usuário, ou `null` se a conta ainda não tem dados. */
export async function fetchState(userId: string): Promise<FinanceState | null> {
  const { data, error } = await supabase.from(TABLE).select('data').eq('user_id', userId).maybeSingle()
  if (error) throw error
  if (!data) return null
  return parseState(data.data) ?? createInitialState()
}

export async function saveState(userId: string, state: FinanceState): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, data: state, updated_at: new Date().toISOString() })
  if (error) throw error
}

/** Cria a linha da conta; não faz nada se ela já existe. */
export async function createState(userId: string, state: FinanceState): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, data: state }, { onConflict: 'user_id', ignoreDuplicates: true })
  if (error) throw error
}

/** Dados deixados no localStorage pela versão sem contas. */
export function readLegacyState(): FinanceState | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    return raw ? parseState(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

/** Apaga os dados antigos depois de importados, para não irem parar na conta de outra pessoa. */
export function clearLegacyState() {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // storage indisponível: nada a limpar
  }
}
