import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HomeLayout } from "../../layouts/HomeLayout";

export function Home() {
  return (
    <HomeLayout>
      <Header />
      <Hero />

      <Outlet />
    </HomeLayout>
  );
}
