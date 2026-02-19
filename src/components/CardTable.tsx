import type React from "react"

import '../styles/cardTable.css'

interface CardTableProps {
  children: React.ReactNode
}

export function CardTable({children}: CardTableProps) {
  return (
    <table className="card-table">
      <thead className="card-table-head">
        <tr className="card-table-headers">
          <th className="card-table-header">Nome</th>
          <th className="card-table-header">Valor</th>
        </tr>
      </thead>
      <tbody className="card-table-body">
        {children}
      </tbody>
    </table>
  )
}