import { formatCurrency } from "../utils/formatCurrency";

interface TotalDisplayProps {
  displayType: string
  value: number
  textClassName?: string
}

export function TotalDisplay({displayType, value, textClassName}: TotalDisplayProps) {
  return (
    <div className="card-content">
      Total {displayType}
      <p className={textClassName}>{formatCurrency(value)}</p>
    </div>
  )
}