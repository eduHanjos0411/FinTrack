# FinTrack

Controle das finanças do mês: entradas, investimentos, despesas fixas, parcelamentos e gastos mensais (débito ou crédito), com categorias personalizáveis. Cada usuário entra com e-mail e senha, e os dados ficam salvos no Supabase, acessíveis em qualquer dispositivo.

## Configuração (uma vez)

1. Crie um projeto grátis em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) (cria a tabela `finance_states` com Row Level Security).
3. Em **Authentication > URL Configuration**, defina o **Site URL** como o endereço onde o app vai ficar publicado e adicione `http://localhost:5173` em **Redirect URLs**. É para lá que apontam os links de confirmação de e-mail e de recuperação de senha.
4. Copie `.env.example` para `.env.local` e preencha com a URL do projeto e a *publishable key* (ou *anon key*), que ficam em **Project Settings > API**.

```bash
npm install
npm run dev
```

Na primeira vez que alguém entra, se o navegador tiver dados da versão antiga (salvos só no localStorage), eles são importados para a conta.

Para publicar (Vercel, Netlify, Cloudflare Pages etc.), basta servir o `dist/` gerado por `npm run build` e configurar as mesmas duas variáveis `VITE_SUPABASE_*` no painel do host.
