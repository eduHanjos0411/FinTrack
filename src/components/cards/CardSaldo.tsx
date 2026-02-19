import type { Valor } from "../../types/valor";
import { formatCurrency } from "../../utils/formatCurrency";
import { sumBy } from "../../utils/sumBy";
import { CardTable } from "../CardTable";
import { Card } from "./Card";

const entradas: Valor[] = [
  {
    nome: "Salário",
    valor: 1125.69,
  },
  {
    nome: "Vale Transporte",
    valor: 180.0,
  },
  {
    nome: "Mamis",
    valor: 200.0,
  },
];

const totalValue = sumBy(entradas, (e) => e.valor);
const total = (
  <div className="card-content">
    Total Recebido:
    <p className="card-saldo-text">{formatCurrency(totalValue)}</p>
  </div>
);

const content = (
  <CardTable>
    {entradas.map((entrada) => (
      <tr className="entry" key={entrada.nome}>
        <td>{entrada.nome}</td>
        <td>{formatCurrency(entrada.valor)}</td>
      </tr>
    ))}
  </CardTable>
);

export function CardSaldo() {
  return (
    <Card
      title="Saldo Total"
      subtitle="Adicione seu saldo recebido"
      content={content}
      total={total}
    />
  );
}
