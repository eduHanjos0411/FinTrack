import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { AuthScreen, AuthShell, NewPasswordScreen } from './components/AuthScreen'
import { CategoryPicker } from './components/CategoryPicker'
import { Hero } from './components/Hero'
import { InstallmentCounter } from './components/InstallmentCounter'
import { PaymentToggle } from './components/PaymentToggle'
import { Row } from './components/Row'
import { Section } from './components/Section'
import { useAuth } from './hooks/useAuth'
import { useCloudState, type SyncStatus } from './hooks/useCloudState'
import { useFinance } from './hooks/useFinance'
import { createId } from './lib/id'
import { formatBRL } from './lib/money'
import { supabase } from './lib/supabase'
import type { FinanceState, MonthItem, MonthListKey } from './types'

export default function App() {
  const { user, recovering, finishRecovery } = useAuth()

  if (user === undefined) return <AuthShell><p className="auth__status">Carregando…</p></AuthShell>
  if (!user) return <AuthScreen />
  if (recovering) return <NewPasswordScreen onDone={finishRecovery} />
  // A chave remonta tudo ao trocar de conta, sem sobrar estado do usuário anterior.
  return <Workspace key={user.id} user={user} />
}

function Workspace({ user }: { user: User }) {
  const cloud = useCloudState(user.id)

  async function signOut() {
    const saved = await cloud.flush()
    if (!saved && !window.confirm('Algumas alterações ainda não foram salvas e serão perdidas. Sair mesmo assim?')) return
    await supabase.auth.signOut()
  }

  if (cloud.status === 'error') {
    return (
      <AuthShell>
        <p className="auth__error" role="alert">Não foi possível carregar seus dados.</p>
        <button type="button" className="auth__submit" onClick={cloud.retry}>
          Tentar de novo
        </button>
        <button type="button" className="auth__link" onClick={() => void supabase.auth.signOut()}>
          Sair
        </button>
      </AuthShell>
    )
  }
  if (!cloud.state) return <AuthShell><p className="auth__status">Carregando seus dados…</p></AuthShell>

  return (
    <Board state={cloud.state} update={cloud.update} email={user.email ?? ''} sync={cloud.sync} onSignOut={signOut} />
  )
}

interface BoardProps {
  state: FinanceState
  update: (fn: (state: FinanceState) => FinanceState) => void
  email: string
  sync: SyncStatus
  onSignOut: () => void
}

function Board({ state, update, email, sync, onSignOut }: BoardProps) {
  const finance = useFinance(state, update)
  const { data, installments, totals, categories } = finance
  // Só o item recém-criado recebe foco, para não roubar o foco ao trocar de mês.
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  function add<K extends MonthListKey>(list: K, item: MonthItem<K>) {
    finance.addItem(list, item)
    setLastAddedId(item.id)
  }

  function addInstallment() {
    const id = createId()
    finance.addInstallment({ id, description: '', categoryId: null, amount: 0, total: 2, start: finance.month })
    setLastAddedId(id)
  }

  const pickerProps = { categories, onCreate: finance.addCategory }

  return (
    <div className="app">
      <Hero
        month={finance.month}
        onMonthChange={finance.setMonth}
        totals={totals}
        categories={categories}
        copiedFrom={finance.copiedFrom}
        email={email}
        sync={sync}
        onSignOut={onSignOut}
      />

      <main className="board">
        <div className="board__col board__col--side">
          <Section
            className="order-incomes"
            title="Entradas"
            description="Salário, VT, presentes, extras"
            accent="var(--accent-income)"
            total={totals.incomes}
            addLabel="Entrada"
            emptyText="Adicione o salário e qualquer dinheiro que entrar."
            isEmpty={data.incomes.length === 0}
            onAdd={() => add('incomes', { id: createId(), description: '', amount: 0 })}
          >
            {data.incomes.map((item) => (
              <Row
                key={item.id}
                description={item.description}
                amount={item.amount}
                placeholder="Ex.: salário"
                autoFocus={item.id === lastAddedId}
                onDescriptionChange={(description) => finance.updateItem('incomes', item.id, { description })}
                onAmountChange={(amount) => finance.updateItem('incomes', item.id, { amount })}
                onRemove={() => finance.removeItem('incomes', item.id)}
              />
            ))}
          </Section>
          <Section
            className="order-investments"
            title="Investimentos"
            description="O que foi guardado neste mês"
            accent="var(--accent-investment)"
            total={totals.investments}
            addLabel="Investimento"
            emptyText="Reserva, previdência, ações…"
            isEmpty={data.investments.length === 0}
            onAdd={() => add('investments', { id: createId(), description: '', amount: 0 })}
          >
            {data.investments.map((item) => (
              <Row
                key={item.id}
                description={item.description}
                amount={item.amount}
                placeholder="Ex.: reserva"
                autoFocus={item.id === lastAddedId}
                onDescriptionChange={(description) => finance.updateItem('investments', item.id, { description })}
                onAmountChange={(amount) => finance.updateItem('investments', item.id, { amount })}
                onRemove={() => finance.removeItem('investments', item.id)}
              />
            ))}
          </Section>
        </div>
        <div className="board__col">
          <Section
            className="order-fixed"
            title="Despesas fixas"
            description="Contas que se repetem todo mês"
            accent="var(--accent-fixed)"
            total={totals.fixed}
            addLabel="Despesa fixa"
            emptyText="Aluguel, contas da casa, assinaturas…"
            isEmpty={data.fixed.length === 0}
            onAdd={() => add('fixed', { id: createId(), description: '', categoryId: null, amount: 0 })}
          >
            {data.fixed.map((item) => (
              <Row
                key={item.id}
                description={item.description}
                amount={item.amount}
                placeholder="Ex.: contas da casa"
                autoFocus={item.id === lastAddedId}
                onDescriptionChange={(description) => finance.updateItem('fixed', item.id, { description })}
                onAmountChange={(amount) => finance.updateItem('fixed', item.id, { amount })}
                onRemove={() => finance.removeItem('fixed', item.id)}
              >
                <CategoryPicker
                  {...pickerProps}
                  value={item.categoryId}
                  onChange={(categoryId) => finance.updateItem('fixed', item.id, { categoryId })}
                />
              </Row>
            ))}
          </Section>
          <Section
            className="order-installments"
            title="Parcelamentos"
            description="Seguem sozinhos para os próximos meses até a última parcela"
            accent="var(--accent-installment)"
            total={totals.installments}
            addLabel="Parcelamento"
            emptyText="Nenhuma compra parcelada neste mês."
            isEmpty={installments.length === 0}
            onAdd={addInstallment}
          >
            {installments.map((item) => (
              <Row
                key={item.id}
                description={item.description}
                amount={item.amount}
                placeholder="Ex.: presente"
                autoFocus={item.id === lastAddedId}
                onDescriptionChange={(description) => finance.updateInstallment(item.id, { description })}
                onAmountChange={(amount) => finance.updateInstallment(item.id, { amount })}
                onRemove={() => finance.removeInstallment(item.id)}
              >
                <InstallmentCounter
                  current={item.current}
                  total={item.total}
                  onCurrentChange={(current) => finance.setInstallmentCurrent(item.id, current)}
                  onTotalChange={(total) => finance.updateInstallment(item.id, { total })}
                />
                <CategoryPicker
                  {...pickerProps}
                  value={item.categoryId}
                  onChange={(categoryId) => finance.updateInstallment(item.id, { categoryId })}
                />
              </Row>
            ))}
          </Section>
        </div>
        <div className="board__col">
          <Section
            className="order-monthly"
            title="Gastos mensais"
            description="O dia a dia: mercado, transporte, delivery…"
            accent="var(--accent-monthly)"
            total={totals.monthly}
            addLabel="Gasto"
            emptyText="Nenhum gasto lançado ainda."
            isEmpty={data.monthly.length === 0}
            onAdd={() =>
              add('monthly', { id: createId(), description: '', categoryId: null, payment: 'debit', amount: 0 })
            }
            footer={
              data.monthly.length > 0 && (
                <p className="split">
                  Débito <strong>{formatBRL(totals.debit)}</strong> · Crédito <strong>{formatBRL(totals.credit)}</strong>
                </p>
              )
            }
          >
            {data.monthly.map((item) => (
              <Row
                key={item.id}
                description={item.description}
                amount={item.amount}
                placeholder="Ex.: mercado"
                autoFocus={item.id === lastAddedId}
                onDescriptionChange={(description) => finance.updateItem('monthly', item.id, { description })}
                onAmountChange={(amount) => finance.updateItem('monthly', item.id, { amount })}
                onRemove={() => finance.removeItem('monthly', item.id)}
              >
                <PaymentToggle
                  value={item.payment}
                  onChange={(payment) => finance.updateItem('monthly', item.id, { payment })}
                />
                <CategoryPicker
                  {...pickerProps}
                  value={item.categoryId}
                  onChange={(categoryId) => finance.updateItem('monthly', item.id, { categoryId })}
                />
              </Row>
            ))}
          </Section>
        </div>
      </main>
    </div>
  )
}
