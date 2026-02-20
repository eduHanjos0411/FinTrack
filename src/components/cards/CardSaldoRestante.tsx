import { useFinance } from "../../contexts/FinanceContext";
import { TotalDisplay } from "../TotalDisplay";
import { Card } from "./Card";

export function CardSaldoRestante() {
  const {saldo, despesas} = useFinance()

  const resultado = saldo.total - despesas.total

  return (
    <Card
    title="Saldo Restante"
    subtitle="Veja aqui o que te resta"
    total={<TotalDisplay textClassName="card-investimento-text" displayType="Saldo Restante" value={resultado}/>}/>

  )
}