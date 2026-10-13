import { useEffect, useRef, useState } from 'react'
import { clearLegacyState, createState, fetchState, readLegacyState, saveState } from '../lib/cloud'
import { createInitialState } from '../lib/defaults'
import type { FinanceState } from '../types'

export type SyncStatus = 'saved' | 'saving' | 'error'

/** Espera as edições pararem antes de salvar, para não mandar uma requisição por tecla. */
const SAVE_DELAY = 800
const RETRY_DELAY = 5000

/**
 * Fila de gravação: guarda só o estado mais recente e salva um por vez.
 * `flush` resolve `true` quando tudo foi gravado.
 */
function createSaver(userId: string, onStatus: (status: SyncStatus) => void) {
  let pending: FinanceState | null = null
  let running: Promise<boolean> | null = null
  let timer: ReturnType<typeof setTimeout> | undefined

  async function run(): Promise<boolean> {
    while (pending) {
      const next = pending
      pending = null
      try {
        await saveState(userId, next)
      } catch {
        pending ??= next
        onStatus('error')
        timer = setTimeout(flush, RETRY_DELAY)
        return false
      }
    }
    onStatus('saved')
    return true
  }

  function flush(): Promise<boolean> {
    clearTimeout(timer)
    running ??= run().finally(() => {
      running = null
    })
    return running
  }

  return {
    schedule(state: FinanceState) {
      pending = state
      onStatus('saving')
      clearTimeout(timer)
      timer = setTimeout(flush, SAVE_DELAY)
    },
    flush,
    isBusy: () => pending !== null || running !== null,
    dispose: () => clearTimeout(timer),
  }
}

/** Primeiro acesso da conta: importa os dados antigos do navegador, se houver. */
async function loadOrCreate(userId: string): Promise<FinanceState> {
  const remote = await fetchState(userId)
  if (remote) return remote
  // Não sobrescreve se outra aba/dispositivo criou a linha nesse meio-tempo.
  await createState(userId, readLegacyState() ?? createInitialState())
  const created = await fetchState(userId)
  if (!created) throw new Error('Não foi possível criar os dados da conta')
  clearLegacyState()
  return created
}

/**
 * Estado do usuário guardado no Supabase. Carrega ao montar, salva com debounce a cada
 * mudança e, ao voltar para a aba, busca de novo (para pegar o que foi editado em outro
 * dispositivo) se não houver alteração local pendente. A última gravação vence.
 */
export function useCloudState(userId: string) {
  const [state, setState] = useState<FinanceState | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [sync, setSync] = useState<SyncStatus>('saved')
  const [saver] = useState(() => createSaver(userId, setSync))
  /** Último estado vindo da nuvem: não precisa ser salvo de volta. */
  const fromRemote = useRef<FinanceState | null>(null)

  useEffect(() => {
    let cancelled = false
    loadOrCreate(userId).then(
      (loaded) => {
        if (cancelled) return
        fromRemote.current = loaded
        setState(loaded)
      },
      () => {
        if (!cancelled) setLoadFailed(true)
      },
    )
    return () => {
      cancelled = true
    }
  }, [userId, attempt])

  useEffect(() => {
    if (state && state !== fromRemote.current) saver.schedule(state)
  }, [state, saver])

  useEffect(() => {
    async function refresh() {
      if (saver.isBusy()) return
      try {
        const remote = await fetchState(userId)
        if (!remote || saver.isBusy()) return
        fromRemote.current = remote
        setState((current) => (current && JSON.stringify(current) === JSON.stringify(remote) ? current : remote))
      } catch {
        // sem rede: segue com o que já está na tela
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') void saver.flush()
      else void refresh()
    }

    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!saver.isBusy()) return
      void saver.flush()
      event.preventDefault()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('beforeunload', onBeforeUnload)
      saver.dispose()
    }
  }, [saver, userId])

  function update(fn: (state: FinanceState) => FinanceState) {
    setState((current) => current && fn(current))
  }

  function retry() {
    setLoadFailed(false)
    setAttempt((n) => n + 1)
  }

  const status = state ? 'ready' : loadFailed ? 'error' : 'loading'
  return { status, state, update, sync, flush: saver.flush, retry } as const
}
