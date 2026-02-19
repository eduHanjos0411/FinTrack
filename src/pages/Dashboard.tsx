import { CardDespesas } from "../components/cards/CardDespesas";
import { CardInvestimentos } from "../components/cards/CardInvestimentos";
import { CardSaldo } from "../components/cards/CardSaldo";
import { TopHeader } from "../components/TopHeader";

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
      </div>
    </div>
  );
}
