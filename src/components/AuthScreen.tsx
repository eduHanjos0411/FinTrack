import { useState, type FormEvent, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'signin' | 'signup' | 'reset'

const MIN_PASSWORD = 6

/** Traduz os erros mais comuns do Supabase Auth. */
function authErrorMessage(error: { message: string; code?: string }): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'E-mail ou senha incorretos.'
    case 'email_not_confirmed':
      return 'Confirme seu e-mail pelo link que enviamos antes de entrar.'
    case 'user_already_exists':
      return 'Já existe uma conta com esse e-mail.'
    case 'weak_password':
      return `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Muitas tentativas. Espere alguns minutos e tente de novo.'
    case 'same_password':
      return 'A nova senha precisa ser diferente da atual.'
  }
  return error.message.includes('fetch') ? 'Sem conexão com o servidor.' : error.message
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth__card">
        <span className="brand auth__brand">FinTrack</span>
        {children}
      </div>
    </div>
  )
}

const TITLES: Record<Mode, string> = {
  signin: 'Entrar',
  signup: 'Criar conta',
  reset: 'Recuperar senha',
}

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(authErrorMessage(error))
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        })
        if (error) setError(authErrorMessage(error))
        // Com confirmação de e-mail ligada, o cadastro não devolve sessão.
        else if (!data.session) setNotice('Conta criada! Confirme pelo link enviado para o seu e-mail e depois entre.')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
        if (error) setError(authErrorMessage(error))
        else setNotice('Se houver uma conta com esse e-mail, você vai receber um link para criar uma nova senha.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="auth__title">{TITLES[mode]}</h1>
      <form className="auth__form" onSubmit={submit}>
        <label className="auth__label">
          E-mail
          <input
            className="auth__input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {mode !== 'reset' && (
          <label className="auth__label">
            Senha
            <input
              className="auth__input"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              minLength={MIN_PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
        {error && <p className="auth__error" role="alert">{error}</p>}
        {notice && <p className="auth__notice" role="status">{notice}</p>}
        <button type="submit" className="auth__submit" disabled={busy}>
          {busy ? 'Aguarde…' : mode === 'signin' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar link'}
        </button>
      </form>
      <div className="auth__links">
        {mode === 'signin' ? (
          <>
            <button type="button" className="auth__link" onClick={() => switchMode('signup')}>
              Criar uma conta
            </button>
            <button type="button" className="auth__link" onClick={() => switchMode('reset')}>
              Esqueci a senha
            </button>
          </>
        ) : (
          <button type="button" className="auth__link" onClick={() => switchMode('signin')}>
            Já tenho conta
          </button>
        )}
      </div>
    </AuthShell>
  )
}

/** Mostrada quando o usuário chega pelo link de recuperação (já com sessão). */
export function NewPasswordScreen({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setError(authErrorMessage(error))
    else onDone()
  }

  return (
    <AuthShell>
      <h1 className="auth__title">Nova senha</h1>
      <form className="auth__form" onSubmit={submit}>
        <label className="auth__label">
          Nova senha
          <input
            className="auth__input"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="auth__error" role="alert">{error}</p>}
        <button type="submit" className="auth__submit" disabled={busy}>
          {busy ? 'Aguarde…' : 'Salvar senha'}
        </button>
      </form>
    </AuthShell>
  )
}
