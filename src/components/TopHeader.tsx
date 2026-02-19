import { Link } from "react-router-dom";

import '../styles/topHeader.css'

export function TopHeader() {
  return (
    <div className="top-header-container">
      <Link to='/perfil/:id' className="btn-edit-user">Editar perfil</Link>
      <p className="greet-text">Seja bem vindo <strong>Eduardo</strong>!</p>
      <p className="subtitle-top-header"> Acompanhe e altere suas finanças por aqui</p>
    </div>
  )
}