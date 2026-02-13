import { Link } from 'react-router-dom'
import '../styles/login.css'

export function Login() {
  return (
    <div className='container-login'>
    <Link className='backto-btn' to="/">Voltar para o início</Link>
      <form className="form-login">
        <h1 className="title-form-login">Bem vindo de volta!</h1>
        <input className='login-form-input' type="text" placeholder="Digite seu usuário"/>
        <input className='login-form-input' type="password" placeholder="Digite sua senha"/>
        <button className="login-btn" type="submit">Login</button>
      </form>
    </div>
  )
}