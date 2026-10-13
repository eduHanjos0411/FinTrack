import type { ReactNode } from 'react'
import { CloseIcon } from './Icons'
import { MoneyInput } from './MoneyInput'

interface RowProps {
  description: string
  amount: number
  placeholder: string
  autoFocus?: boolean
  onDescriptionChange: (description: string) => void
  onAmountChange: (amount: number) => void
  onRemove: () => void
  /** Campos extras entre a descrição e o valor (categoria, tipo, parcelas). */
  children?: ReactNode
}

export function Row({
  description,
  amount,
  placeholder,
  autoFocus,
  onDescriptionChange,
  onAmountChange,
  onRemove,
  children,
}: RowProps) {
  const name = description || placeholder
  return (
    <li className="row">
      <input
        className="field row__desc"
        value={description}
        placeholder={placeholder}
        aria-label="Descrição"
        autoFocus={autoFocus}
        onChange={(event) => onDescriptionChange(event.target.value)}
      />
      {children && <div className="row__meta">{children}</div>}
      <MoneyInput className="row__amount" value={amount} label={`Valor de ${name}`} onChange={onAmountChange} />
      <button type="button" className="icon-button row__remove" aria-label={`Remover ${name}`} onClick={onRemove}>
        <CloseIcon size={16} />
      </button>
    </li>
  )
}
