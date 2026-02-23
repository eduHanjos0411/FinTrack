import { FormLayout } from "../layouts/FormLayout";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";

export function Login() {
  return (
    <FormLayout>
      <h1 className="title-form-login">Bem vindo de volta!</h1>
      <Input type="email" placeholder="Digite seu email" />
      <Input type="password" placeholder="Digite sua senha" />
      <Button variant="btn btn-form" type="submit">
        Entrar
      </Button>
    </FormLayout>
  );
}
