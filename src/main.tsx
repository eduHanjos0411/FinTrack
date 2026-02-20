import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { FinanceProvider } from "./contexts/FinanceContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FinanceProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FinanceProvider>
  </StrictMode>,
);
