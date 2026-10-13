import type { PaymentType } from '../types'

const OPTIONS: { value: PaymentType; label: string }[] = [
  { value: 'debit', label: 'Débito' },
  { value: 'credit', label: 'Crédito' },
]

interface PaymentToggleProps {
  value: PaymentType
  onChange: (value: PaymentType) => void
}

export function PaymentToggle({ value, onChange }: PaymentToggleProps) {
  return (
    <div className="segmented" role="group" aria-label="Tipo de pagamento">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="segmented__option"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
