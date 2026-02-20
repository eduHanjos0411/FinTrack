import { Link } from "react-router-dom";

import '../styles/header.css'

export function Header() {
  return (
    <header className="header-home">
      <h1 className="title-header">FinTrack</h1>
      <nav className="nav-container">
        <Link className="nav-link" to="/login">Login</Link>
        <Link className="nav-link" to="/registro">Registro</Link>
      </nav>
    </header>
  )
}