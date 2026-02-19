import type { Valor } from "../../types/valor";
import { formatCurrency } from "../../utils/formatCurrency";
import { sumBy } from "../../utils/sumBy";
import { CardTable } from "../CardTable";
import { Card } from "./Card";

const despesas: Valor[] = [
  {
    nome: "Conta de telefone",
    valor: 75,
  },
  {
    nome: "Spotify",
    valor: 45,
  },
  {
    nome: "Dinheiro da viagem",
    valor: 500,
  },
];

const totalValueDespesas = sumBy(despesas, (d) => d.valor);

const total = (
  <div className="card-content">
    Total Gasto:
    <p className="card-despesas-text">{formatCurrency(totalValueDespesas)}</p>
  </div>
);

const content = (
  <CardTable>
    {despesas.map((despesa) => (
      <tr key={despesa.nome}>
        <td>{despesa.nome}</td>
        <td>{formatCurrency(despesa.valor)}</td>
      </tr>
    ))}
  </CardTable>
);

export function CardDespesas() {
  return (
    <Card
      title="Despesas Totais"
      subtitle="Adicione suas despesas aqui"
      content={content}
      total={total}
    />
  );
}
