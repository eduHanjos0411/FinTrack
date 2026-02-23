import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home/Home";

import { Dashboard } from "../pages/dashboard/Dashboard";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { SaldoDetails } from "../pages/dashboard/pages/SaldoDetails";
import { DespesasDetails } from "../pages/dashboard/pages/DespesasDetails";
import { InvestimentoDetails } from "../pages/dashboard/pages/InvestimentoDetails";
import { DetailsLayout } from "../pages/dashboard/components/DetailsLayout";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="registro" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/details" element={<DetailsLayout />}>
        <Route path="saldo" element={<SaldoDetails />} />
        <Route path="despesa" element={<DespesasDetails />} />
        <Route path="investimentos" element={<InvestimentoDetails />} />
      </Route>
    </Routes>
  );
}
