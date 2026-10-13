# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev       # servidor de desenvolvimento com HMR
npm run build     # tsc -b (checagem de tipos) + vite build -> dist/
npm run lint      # ESLint (flat config, inclui as regras do eslint-plugin-react-hooks v7)
npm run preview   # serve o build de produção
```

Ainda não existe test runner. Se for adicionar, use o Vitest (`npx vitest run caminho/do/arquivo.test.ts` roda um único arquivo). Por enquanto, a lógica pura em `src/lib/` pode ser testada direto com `node --experimental-strip-types arquivo.ts`.

TypeScript (`tsconfig.app.json`): `strict`, `noUnusedLocals`/`noUnusedParameters`, `verbatimModuleSyntax` (imports usados só como tipo precisam de `import type`) e `erasableSyntaxOnly` (sem `enum`, sem `namespace` e sem parameter properties; use uniões de literais).

## Produto

O FinTrack substitui uma planilha pessoal de finanças mensais: `docs/planilha.png` é a referência do conteúdo original. A meta é manter a flexibilidade da planilha sem a aparência de grade: os cartões têm linhas editáveis no próprio lugar. A interface é em pt-BR e os valores são em BRL. Os identificadores no código ficam em inglês.

Regras de domínio que precisam ser preservadas:

- **Todo valor é editável.** O `MoneyInput` aceita formato brasileiro (`1.508,50`) e contas (`1508+200`) via `parseAmountExpression`. Para "recebi um dinheiro extra", o usuário pode adicionar uma nova entrada ou somar a uma entrada existente.
- **Três grupos de gastos, sempre separados:** fixos (`fixed`), parcelamentos (`installments`) e mensais (`monthly`). Só os mensais têm o tipo de pagamento `debit`/`credit`.
- **Categorias são dados, não uma união fixa.** Os padrões ficam em `lib/defaults.ts` (transporte, alimentação, delivery, roupas, eletrônicos, jogos), e o usuário cria novas pelo `CategoryPicker`.
- **Totais nunca são armazenados**, sempre derivados em `computeTotals`. O "Total a pagar" é fixos + parcelas + mensais. A "Sobra" é entradas − total a pagar − investimentos.

## Arquitetura

O estado inteiro (`FinanceState` em `src/types.ts`) é um único documento JSON por usuário, guardado no Supabase na tabela `finance_states` (`user_id`, `data jsonb`, com RLS; schema em `supabase/schema.sql`). Não há backend próprio nem roteador: o front fala direto com o Supabase (`lib/supabase.ts`, configurado por `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no `.env.local`). Mudanças no formato salvo exigem incrementar `version` e migrar em `parseState` (`lib/cloud.ts`).

- **Fluxo:** `App` usa `useAuth` (login por e-mail/senha, recuperação de senha) e, com usuário logado, monta `Workspace` com `key={user.id}`. Ele usa `useCloudState`, que carrega o estado, salva com debounce a cada mudança (fila em `createSaver`: um envio por vez, sempre o estado mais recente, nova tentativa em caso de erro) e busca de novo ao voltar para a aba quando não há alteração local pendente. A última gravação vence. `Board` recebe o estado e o `update`, e o `useFinance(state, update)` só deriva e edita, sem persistir nada.
- **Primeiro login:** se a conta não tem linha, `loadOrCreate` importa o localStorage antigo (`fintrack:v1`), apaga-o e cria a linha com `ignoreDuplicates`, para não sobrescrever o que outra aba tenha criado.

Pontos que não ficam óbvios lendo um arquivo só:

- **Meses são `MonthKey` (`YYYY-MM`)** e indexam `state.months`. Um mês ainda não salvo é *derivado* por `resolveMonth` (`lib/finance.ts`): ele herda entradas, investimentos e fixos do último mês salvo anterior a ele, e os gastos mensais começam vazios. Os itens herdados mantêm os mesmos ids, então a primeira edição (`updateMonth`) materializa o mês sem quebrar as referências. Nunca escreva estado durante o render para "criar" o mês.
- **Parcelamentos não pertencem a um mês.** Eles ficam em `state.installments` com `start` (mês da parcela 1) e `total`. A parcela do mês aberto é calculada (`activeInstallments`), e a compra só aparece nos meses em que `1 ≤ current ≤ total`. Editar a "parcela atual" desloca o `start` (`setInstallmentCurrent`).
- **A UI é composta em `App.tsx`:** um `Section` por grupo, um `Row` por item (descrição + campos extras via `children` + `MoneyInput` + remover). O topo (`Hero`) traz os totais e a `SpendingBar` (uso das entradas por categoria).
- **Layout sem rolagem de página no desktop:** a partir de `min-width: 1024px` e `min-height: 600px`, `.app` ocupa exatamente a altura da tela e `.board` vira uma grade de 3 colunas (entradas/investimentos · fixos/parcelamentos · mensais). Cada `.section__body` rola por dentro. Abaixo disso, `.board__col` vira `display: contents`, a página rola normalmente e as classes `order-*` definem a ordem. Por causa das listas com overflow, o menu do `CategoryPicker` usa `position: fixed`, calculado na abertura, e fecha ao rolar ou redimensionar. As linhas quebram em duas por container query (`.section` é `container-type: inline-size`), não por largura da tela.
- **Estilo:** um único `src/index.css`, com tokens em `:root` e variantes em `prefers-color-scheme: dark`. As cores por instância são passadas como custom properties (`--accent` por seção, `--chip` por categoria) via `cssVar()` de `lib/style.ts`.
