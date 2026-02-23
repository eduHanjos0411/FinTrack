import { Link } from "react-router-dom";

import { FormLayout } from "../layouts/FormLayout";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";

export function Register() {
  return (
    <FormLayout>
      <Link className="backto-btn" to="/">
        Voltar para o início
      </Link>
      <h1 className="register-title">Crie sua conta e comece já</h1>
      <Input placeholder="Digite seu usuário" type="text" />
      <Input placeholder="Digite seu email" type="email" />
      <Input placeholder="Digite sua senha" type="password" />
      <Button variant="btn btn-form" type="submit">
        Registrar
      </Button>
    </FormLayout>
  );
}
