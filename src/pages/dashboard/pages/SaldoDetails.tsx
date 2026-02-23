import { useFinance } from "../../../contexts/FinanceContext";

export function SaldoDetails() {
  const { saldo } = useFinance()

  return (
    <>
      <ul>

      {saldo.valores.map((valor) => (
        <li key={valor.nome}>
          <p>{valor.nome}: R$ {valor.valor}</p>
        </li>
      ))}
      </ul>
    </>
  );
}
