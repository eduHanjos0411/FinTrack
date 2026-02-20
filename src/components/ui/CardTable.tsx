
import '../styles/cardTable.css'
import type { Valor } from "../../features/finance/types/valor"
import { formatCurrency } from '../../utils/formatCurrency'

interface CardTableProps {
  items: Valor[]
  colorValue: string
  valueType: string
}

export function CardTable({items, colorValue, valueType}: CardTableProps) {
  return (
    <table className="card-table">
      <tbody className="card-table-body">
        {items.map((item) => (
          <tr key={item.nome}>
            <td>{item.nome}</td>
            <td className={colorValue}>{valueType} {formatCurrency(item.valor)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}