import type { Valor } from "../../types/valor";
import { formatCurrency } from "../../utils/formatCurrency";
import { sumBy } from "../../utils/sumBy";
import { CardTable } from "../CardTable";
import { Card } from "./Card";

const investimentos: Valor[] = [
  {
    nome: "Reserva",
    valor: 200,
  },
  {
    nome: "CDB",
    valor: 150,
  },
  {
    nome: "FII",
    valor: 300,
  },
];

const totalValue = sumBy(investimentos, (i) => i.valor);

const total = (
  <div className="card-content">
    Total Investido:
    <p className="card-investimento-text">{formatCurrency(totalValue)}</p>
  </div>
);

const content = (
  <CardTable>
    {investimentos.map((investimento) => (
      <tr key={investimento.nome}>
        <td>{investimento.nome}</td>
        <td className="td-valor">{formatCurrency(investimento.valor)}</td>
      </tr>
    ))}
  </CardTable>
);

export function CardInvestimentos() {
  return (
    <Card
      title="Total Investido"
      subtitle="Adicione seus investimentos"
      total={total}
      content={content}
    />
  );
}
