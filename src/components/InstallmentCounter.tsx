import { useState } from 'react'

interface CountInputProps {
  value: number
  min: number
  max: number
  label: string
  onChange: (value: number) => void
}

function CountInput({ value, min, max, label, onChange }: CountInputProps) {
  const [draft, setDraft] = useState<string | null>(null)

  function commit() {
    if (draft !== null) {
      const parsed = Number.parseInt(draft, 10)
      if (!Number.isNaN(parsed)) onChange(Math.min(Math.max(parsed, min), max))
    }
    setDraft(null)
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label={label}
      className="field counter__input"
      value={draft ?? String(value)}
      onFocus={(event) => {
        setDraft(String(value))
        event.currentTarget.select()
      }}
      onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
      }}
    />
  )
}

interface InstallmentCounterProps {
  current: number
  total: number
  onCurrentChange: (current: number) => void
  onTotalChange: (total: number) => void
}

/** Parcela atual / total de parcelas, os dois editáveis. */
export function InstallmentCounter({ current, total, onCurrentChange, onTotalChange }: InstallmentCounterProps) {
  const remaining = total - current
  return (
    <span
      className="counter"
      title={remaining === 0 ? 'Última parcela' : `Faltam ${remaining} parcela${remaining > 1 ? 's' : ''}`}
    >
      <CountInput value={current} min={1} max={total} label="Parcela atual" onChange={onCurrentChange} />
      <span className="counter__sep">/</span>
      <CountInput value={total} min={current} max={999} label="Total de parcelas" onChange={onTotalChange} />
    </span>
  )
}
