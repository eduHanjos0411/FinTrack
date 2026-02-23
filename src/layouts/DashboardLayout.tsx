import type React from "react";

import "../styles/layout/dashboardLayout.css";

interface DashboardLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLayout({ header, children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">{header}</header>
      <div className="content">{children}</div>
    </div>
  );
}
