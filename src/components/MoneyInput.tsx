import { useRef, useState } from 'react'
import { formatBRL, parseAmountExpression, toEditable } from '../lib/money'

interface MoneyInputProps {
  value: number
  onChange: (value: number) => void
  label: string
  className?: string
}

/**
 * Campo de valor editável no lugar. Mostra o valor formatado em BRL e, ao focar,
 * vira texto livre: aceita `1.508,50` e contas como `1508+200`.
 * Enter confirma, Esc cancela.
 */
export function MoneyInput({ value, onChange, label, className = '' }: MoneyInputProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const cancelled = useRef(false)
  const invalid = draft !== null && parseAmountExpression(draft) === null

  function commit() {
    if (draft !== null && !cancelled.current) {
      const parsed = parseAmountExpression(draft)
      if (parsed !== null && parsed !== value) onChange(parsed)
    }
    cancelled.current = false
    setDraft(null)
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={label}
      aria-invalid={invalid || undefined}
      title="Dica: digite 1500+200 para somar"
      placeholder="R$ 0,00"
      className={`field money ${value < 0 ? 'money--negative' : ''} ${className}`}
      value={draft ?? formatBRL(value)}
      onFocus={(event) => {
        setDraft(toEditable(value))
        const input = event.currentTarget
        requestAnimationFrame(() => input.select())
      }}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
        if (event.key === 'Escape') {
          cancelled.current = true
          event.currentTarget.blur()
        }
      }}
    />
  )
}
