const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatBRL(value: number): string {
  return brl.format(value)
}

/** Valor como aparece no campo durante a edição: `1508,5`, sem símbolo nem milhar. */
export function toEditable(value: number): string {
  if (value === 0) return ''
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 2, useGrouping: false })
}

function parseNumber(text: string): number | null {
  let normalized: string
  if (text.includes(',')) {
    normalized = text.replace(/\./g, '').replace(',', '.')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
    normalized = text.replace(/\./g, '')
  } else {
    normalized = text
  }
  if (!/^(\d+\.?\d*|\.\d+)$/.test(normalized)) return null
  return Number(normalized)
}

/**
 * Interpreta o que o usuário digitou num campo de valor. Aceita formato brasileiro
 * (`1.508,50`) e somas/subtrações (`1508+200`, `350 - 49,90`), para que dê para
 * acrescentar um valor a um total existente sem fazer a conta de cabeça.
 * Retorna `null` se o texto não for válido; vazio vale 0.
 */
export function parseAmountExpression(input: string): number | null {
  const cleaned = input.replace(/R\$/gi, '').replace(/\s+/g, '')
  if (cleaned === '') return 0

  const terms = cleaned.match(/[+-]?[^+-]+/g)
  if (!terms || terms.join('') !== cleaned) return null

  let total = 0
  for (const term of terms) {
    const sign = term.startsWith('-') ? -1 : 1
    const value = parseNumber(term.replace(/^[+-]/, ''))
    if (value === null) return null
    total += sign * value
  }
  return Math.round(total * 100) / 100
}
