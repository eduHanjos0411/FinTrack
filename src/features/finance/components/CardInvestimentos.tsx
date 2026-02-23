import { useFinance } from "../../../contexts/FinanceContext";
import { CardTable } from "../../../components/ui/CardTable";
import { Card } from "../../../components/ui/Card";
import { TotalDisplay } from "./TotalDisplay";

export function CardInvestimentos() {
  const { investimentos } = useFinance();

  return (
    <Card
      redirectTo="/dashboard/details/investimentos"
      title="Total Investido"
      subtitle="Adicione seus investimentos"
      children="Últimas Transações"
      content={
        <CardTable
          colorValue="card-saldo-text"
          valueType="+"
          items={investimentos.valores}
        />
      }
      total={
        <TotalDisplay
          textClassName="card-investimento-text"
          displayType="Investido"
          value={investimentos.total}
        />
      }
    />
  );
}
