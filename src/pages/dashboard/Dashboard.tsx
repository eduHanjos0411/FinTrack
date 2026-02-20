import { CardDespesas } from "../../features/finance/components/CardDespesas";
import { CardInvestimentos } from "../../features/finance/components/CardInvestimentos";
import { CardSaldo } from "../../features/finance/components/CardSaldo";
import { CardSaldoRestante } from "../../features/finance/components/CardSaldoRestante";
import { TopHeader } from "./components/TopHeader";

import "../styles/dashboard.css";

export function Dashboard() {
  return (
    <div className="container-dashboard">
      <header className="header-dashboard">
        <TopHeader />
      </header>
      <div className="cards-container">
        <CardSaldo />
        <CardDespesas />
        <CardInvestimentos />
        <CardSaldoRestante/>
      </div>
    </div>
  );
}
