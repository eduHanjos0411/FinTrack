import { Link, Outlet } from "react-router-dom";

export function DetailsLayout() {
  return (
    <>
      <header className="header-details">
        <h1> Mais detalhes sobre </h1>
      </header>
      <div className="details-content">
        <nav>
          <Link to="/saldo">Saldo</Link> <Link to="despesas">Despesas</Link>{" "}
          <Link to="investimentos">Investimentos</Link>{" "}
        </nav>
        <Outlet />
      </div>
    </>
  );
}
