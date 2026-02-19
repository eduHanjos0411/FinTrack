import { useMemo, useState } from "react";
import type { Valor } from "../types/valor";
import { sumBy } from "../utils/sumBy";

export function useValores(initalValues: Valor[]) {
  const [valores, setValores] = useState<Valor[]>(initalValues)

  const total =  sumBy(valores, (item) => item.valor)

  function addValor(novoValor: Valor) {
    setValores((prev) => [...prev, novoValor])
  }

  function removeVAl
}