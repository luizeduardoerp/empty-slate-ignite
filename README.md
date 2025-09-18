
# Sistema ERP Financeiro

Um sistema completo de gestão financeira desenvolvido com React, TypeScript e Supabase.

## 🚀 Funcionalidades

- **Gestão de Categorias**: Organize receitas e despesas por categorias
- **Gestão de Clientes**: Cadastre e gerencie informações de clientes
- **Gestão de Fornecedores**: Controle seus fornecedores e países de origem
- **Contas Bancárias**: Gerencie suas contas bancárias
- **Transações**: Registre e acompanhe todas as transações financeiras
- **Usuários**: Sistema de controle de acesso e usuários
- **Dashboard**: Visão geral dos dados financeiros
- **Relatórios**: Gráficos e análises financeiras

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Internacionalização**: i18next
- **Build Tool**: Vite

## 📦 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd luizeduardoerp
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o Supabase no arquivo `src/integrations/supabase/client.ts`

5. Execute o projeto:
```bash
npm run dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes UI base (shadcn/ui)
│   ├── CategoryList.tsx
│   ├── CategoryForm.tsx
│   └── ...
├── hooks/              # Hooks customizados
│   ├── useCategories.ts
│   ├── useSuppliers.ts
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Categorias.tsx
│   ├── Fornecedores.tsx
│   └── ...
├── utils/              # Utilitários
├── constants/          # Constantes
└── integrations/       # Integrações (Supabase)
```

## 🗄️ Banco de Dados

O projeto utiliza Supabase com as seguintes tabelas principais:

- `categories` - Categorias de receitas e despesas
- `clients` - Informações dos clientes
- `suppliers` - Fornecedores
- `bank_accounts` - Contas bancárias
- `transactions` - Transações financeiras
- `users` - Usuários do sistema

## 🔐 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de acesso baseadas em usuários
- Validação de dados no frontend e backend

## 🌐 Internacionalização

O sistema suporta múltiplos idiomas através do i18next:
- Português (pt)
- Inglês (en)

## 📱 Responsividade

Interface totalmente responsiva, adaptada para:
- Desktop
- Tablet
- Mobile

## 🚀 Deploy

O projeto pode ser facilmente implantado em:
- Vercel
- Netlify
- Supabase Hosting
- Ou qualquer plataforma que suporte aplicações React

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através dos issues do GitHub.
