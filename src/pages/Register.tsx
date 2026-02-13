import { Link } from "react-router-dom";

import '../styles/register.css'

export function Register() {
  return (
    <div className="container-register">
      <Link className="backto-btn" to="/">Voltar para o início</Link>
      <form className="form-register">
        <h1 className="form-register-title">Crie sua conta e comece já</h1>
        <input className="register-form-input" placeholder="Digite seu usuário" type="text"/>
        <input className="register-form-input" placeholder="Digite seu email" type="email"/>
        <input className="register-form-input" placeholder="Digite sua senhas" type="password"/>
        <button className="register-btn" type="submit">Registrar</button>
      </form>
    </div>
  )
}