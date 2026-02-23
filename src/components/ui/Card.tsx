import type React from "react";

import "../../styles/card.css";
import { Button } from "../common/Button";
interface cardProps {
  title: string;
  subtitle: string;
  total: React.ReactNode;
  content?: React.ReactNode;
  children?: React.ReactNode;
  redirectTo: string;
}

export function Card({
  title,
  subtitle,
  total,
  content,
  children,
  redirectTo,
}: cardProps) {
  return (
    <div className="card-container">
      <div className="card-top">
        <h3 className="card-title">{title}</h3>
        <h4 className="card-subtitle">{subtitle}</h4>
        <div className="card-total">{total}</div>
        <div className="card-actions">
          <Button variant="btn btn-card" type="button">
            Editar
          </Button>
          <Button
            type="button"
            onClick={() => (window.location.href = redirectTo)}
            className="btn btn-card"
          >
            Ver detalhes
          </Button>
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
