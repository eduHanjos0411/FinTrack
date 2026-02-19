import React, { useState } from "react";

interface AddValueModalProps {
  onAdd: (entrada: { nome: string; valor: number }) => void;
  onClose: () => void;
}

export function AddValueModal({ onAdd, onClose }: AddValueModalProps) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nome || !valor) return;

    onAdd({
      nome,
      valor: Number(valor),
    });

    setNome("");
    setValor("");
  }

  return (
    <div className="modal-overlay">
      <form className="add-value-modal-container" onSubmit={handleSubmit}>
        <p>Digite a entrada:</p>
        <input
          className="input-add-value-modal"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Freela da loja de roupa"
        />
        <p>Digite o valor recebido:</p>
        <input
          className="input-add-value-modal"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ex: 1200"
        />
        <button type="submit">Adicionar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}
