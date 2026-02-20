import { useFinance } from "../../../contexts/FinanceContext";
import { CardTable } from "../../../components/ui/CardTable";
import { TotalDisplay } from "../TotalDisplay";
import { Card } from "../../../components/ui/Card";

export function CardSaldo() {
  const {saldo} = useFinance()

  return (
    <Card
      title="Saldo Total"
      subtitle="Adicione seu saldo recebido"
      children="Últimas Transações"
      content={<CardTable valueType="+" colorValue="card-saldo-text" items={saldo.valores} />}
      total={<TotalDisplay textClassName="card-saldo-text" displayType="Recebido" value={saldo.total} />}
    />
  );
}
