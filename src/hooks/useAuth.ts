import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

/**
 * Usuário logado: `undefined` enquanto a sessão salva é lida, `null` se ninguém entrou.
 * `recovering` fica ligado quando o usuário chega pelo link de "esqueci a senha".
 */
export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [recovering, setRecovering] = useState(false)

  useEffect(() => {
    // Dispara INITIAL_SESSION logo de cara, então não precisa de getSession().
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return { user, recovering, finishRecovery: () => setRecovering(false) }
}
