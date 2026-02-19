import type React from "react";

import '../../styles/card.css'

interface cardProps {
  title: string;
  subtitle: string;
  total: React.ReactNode;
  content: React.ReactNode;
}

export function Card({ title, subtitle, total, content }: cardProps) {
  return (
    <div className="card-container">
      <div className="card-top">
      <h3 className="card-title">{title}</h3>
      <h4 className="card-subtitle">{subtitle}</h4>
      <div className="card-total">{total}</div>
      <button className="btn-card">Adicionar</button>
      <hr />
      <div className="card-content">{content}</div>
      </div>
      <ul className="card-list">
        <li className="card-list-item"></li>
      </ul>
    </div>
  )
}