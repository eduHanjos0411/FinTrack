import { useFinance } from "../../contexts/FinanceContext";
import { CardTable } from "../CardTable";
import { TotalDisplay } from "../TotalDisplay";
import { Card } from "./Card";

export function CardDespesas() {
  const {despesas} = useFinance()

  return (
    <Card
      title="Despesas Totais"
      subtitle="Adicione suas despesas aqui"
      children="Últimas Transações"
      content={<CardTable colorValue="card-despesas-text" valueType="-" items={despesas.valores}/>}
      total={<TotalDisplay textClassName="card-despesas-text" displayType="Gasto" value={despesas.total} />}
    />
  );
}
