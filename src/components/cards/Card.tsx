import type React from "react";

import "../../styles/card.css";
interface cardProps {
  title: string
  subtitle: string
  total: React.ReactNode
  content?: React.ReactNode
  children?: React.ReactNode
}

export function Card({ title, subtitle, total, content, children }: cardProps) {
  return (
    <div className="card-container">
      <div className="card-top">
        <h3 className="card-title">{title}</h3>
        <h4 className="card-subtitle">{subtitle}</h4>
        <div className="card-total">{total}</div>
        <div className="card-actions">
          <button className="btn-card">Adicionar</button>
          <button className="btn-card">Ver detalhes</button>
        </div>
        <hr />
        <div className="card-bottom">
          <p>{children}</p>
          <div className="card-content">{content}</div>
        </div>
      </div>
    </div>
  );
}
