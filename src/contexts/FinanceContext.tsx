import React, { createContext, useContext } from "react";
import { useValores } from "../features/finance/hooks/useValores";

interface FinanceContextType {
  saldo: ReturnType<typeof useValores>;
  despesas: ReturnType<typeof useValores>;
  investimentos: ReturnType<typeof useValores>;
}

const FinanceContext = createContext<FinanceContextType | null>(null)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const saldo = useValores([
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
  ])

  const despesas = useValores([
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
  ])

  const investimentos = useValores([
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
  ])

  return (
    <FinanceContext.Provider value={{ saldo, despesas, investimentos}}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if(!context) {
    throw new Error("useFinance must be used inside a FinanceProvider")
  }
  return context
}
