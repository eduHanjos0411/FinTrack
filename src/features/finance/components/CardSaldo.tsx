import { useFinance } from "../../../contexts/FinanceContext";
import { Card } from "../../../components/ui/Card";
import { TotalDisplay } from "./TotalDisplay";
import { CardTable } from "../../../components/ui/CardTable";

export function CardSaldo() {
  const { saldo } = useFinance();

  return (
    <Card
      redirectTo="/dashboard/details/saldo"
      title="Saldo Total"
      subtitle="Adicione seu saldo recebido"
      children="Últimas Transações"
      content={
        <CardTable
          valueType="+"
          colorValue="card-saldo-text"
          items={saldo.valores}
        />
      }
      total={
        <TotalDisplay
          textClassName="card-saldo-text"
          displayType="Recebido"
          value={saldo.total}
        />
      }
    />
  );
}
