import type React from "react";

import "../styles/layout/formLayout.css";
import { Button } from "../components/common/Button";

export function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-form">
      <Button
        variant="btn backto-btn"
        type="button"
        onClick={() => (window.location.href = "/")}
      >
        Voltar ao início
      </Button>
      <form className="form-layout">{children}</form>
    </div>
  );
}
