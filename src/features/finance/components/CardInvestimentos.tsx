import { useFinance } from "../../../contexts/FinanceContext";
import { CardTable } from "../../../components/ui/CardTable";
import { TotalDisplay } from "../TotalDisplay";
import { Card } from "../../../components/ui/Card";

export function CardInvestimentos() {
const { investimentos } = useFinance()

  return (
    <Card
      title="Total Investido"
      subtitle="Adicione seus investimentos"
      children="Últimas Transações"
      content={<CardTable colorValue="card-saldo-text" valueType="+" items={investimentos.valores} />}
      total={<TotalDisplay textClassName="card-investimento-text" displayType="Investido" value={investimentos.total}/>}
    />
  );
}
