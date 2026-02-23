import { Outlet } from "react-router-dom";
import { CardDespesas } from "../../features/finance/components/CardDespesas";
import { CardInvestimentos } from "../../features/finance/components/CardInvestimentos";
import { CardSaldo } from "../../features/finance/components/CardSaldo";
import { CardSaldoRestante } from "../../features/finance/components/CardSaldoRestante";
import { TopHeader } from "./components/TopHeader";
import { DashboardLayout } from "../../layouts/DashboardLayout";

export function Dashboard() {
  return (
    <DashboardLayout header={<TopHeader />}>
      <Outlet />

      <CardSaldo />
      <CardDespesas />
      <CardInvestimentos />
      <CardSaldoRestante />
    </DashboardLayout>
  );
}
