import type React from "react";

import "../styles/layout/homeLayout.css";

export function HomeLayout({ children }: { children: React.ReactNode }) {
  return <div className="home-container">{children}</div>;
}
