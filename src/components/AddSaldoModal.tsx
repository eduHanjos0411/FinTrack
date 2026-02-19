
export function AddSaldoModal() {
  return (
    <form className="add-saldo-modal-container">
      <p>Digite a entrada:</p>
      <input className="input-add-saldo-modal" type="text" placeholder="Ex: Freela da loja de roupa"/>
      <p>Digite o valor recebido:</p>
      <input className="input-add-saldo-modal" type="number" placeholder="Ex: 1200"/>
      <button>Adicionar</button>
    </form>
  )
}