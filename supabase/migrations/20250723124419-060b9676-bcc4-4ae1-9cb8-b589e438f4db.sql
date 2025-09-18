
-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor TEXT NOT NULL,
  pais_origem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank_accounts table
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  banco TEXT NOT NULL,
  tipo TEXT NOT NULL,
  zelle TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  valor DECIMAL(15,2) NOT NULL,
  descricao TEXT,
  categoria_id UUID REFERENCES public.categories(id),
  client_id UUID REFERENCES public.clients(id),
  bank_account_id UUID REFERENCES public.bank_accounts(id),
  payment_method TEXT NOT NULL,
  data_vencimento DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users table for user management
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  nivel_acesso TEXT NOT NULL CHECK (nivel_acesso IN ('administrador', 'financeiro', 'visualizador')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on suppliers" ON public.suppliers FOR ALL USING (true);
CREATE POLICY "Allow all operations on bank_accounts" ON public.bank_accounts FOR ALL USING (true);
CREATE POLICY "Allow all operations on categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on transactions" ON public.transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true);

-- Insert default expense categories
INSERT INTO public.categories (nome, tipo, descricao) VALUES
('Salaries and Wages', 'despesa', 'Salários e ordenados'),
('Repairs and Maintenance', 'despesa', 'Reparos e manutenção'),
('Rents', 'despesa', 'Aluguéis'),
('State Taxes', 'despesa', 'Impostos estaduais'),
('Property Taxes', 'despesa', 'Impostos sobre propriedade'),
('Payroll Taxes', 'despesa', 'Impostos sobre folha de pagamento'),
('Licenses', 'despesa', 'Licenças'),
('Other Taxes', 'despesa', 'Outros impostos'),
('Interest', 'despesa', 'Juros'),
('Meals', 'despesa', 'Refeições'),
('Accounting', 'despesa', 'Contabilidade'),
('Amortization', 'despesa', 'Amortização'),
('Automobile Expenses - Gasoline', 'despesa', 'Despesas automobilísticas - gasolina'),
('Automobile Expenses - Repair and Maintenance', 'despesa', 'Despesas automobilísticas - reparo e manutenção'),
('Bank Charges', 'despesa', 'Taxas bancárias'),
('Cleaning', 'despesa', 'Limpeza'),
('Commissions', 'despesa', 'Comissões'),
('Computer services and supplies', 'despesa', 'Serviços e suprimentos de informática'),
('Credit and collection costs', 'despesa', 'Custos de crédito e cobrança'),
('Delivery and freight', 'despesa', 'Entrega e frete'),
('Discounts', 'despesa', 'Descontos'),
('Dues and subscriptions', 'despesa', 'Taxas e assinaturas'),
('Equipment rent', 'despesa', 'Aluguel de equipamentos'),
('Gifts', 'despesa', 'Presentes'),
('Insurance', 'despesa', 'Seguros'),
('Janitorial', 'despesa', 'Serviços de limpeza'),
('Laundry and cleaning', 'despesa', 'Lavanderia e limpeza'),
('Legal and professional', 'despesa', 'Serviços jurídicos e profissionais'),
('Miscellaneous', 'despesa', 'Diversos'),
('Office Expenses', 'despesa', 'Despesas de escritório'),
('Outside services/independent contractors', 'despesa', 'Serviços externos/contratados independentes'),
('Parking fees and toll', 'despesa', 'Taxas de estacionamento e pedágio'),
('Permit and fees', 'despesa', 'Licenças e taxas'),
('Postage', 'despesa', 'Postagem'),
('Printing', 'despesa', 'Impressão'),
('Security', 'despesa', 'Segurança'),
('Supplies', 'despesa', 'Suprimentos'),
('Telephone', 'despesa', 'Telefone'),
('Tools', 'despesa', 'Ferramentas'),
('Training/continuing education', 'despesa', 'Treinamento/educação continuada'),
('Travel', 'despesa', 'Viagem'),
('Uniform', 'despesa', 'Uniformes'),
('Utilities', 'despesa', 'Utilidades públicas');

-- Add some default revenue categories
INSERT INTO public.categories (nome, tipo, descricao) VALUES
('Sales Revenue', 'receita', 'Receita de vendas'),
('Service Revenue', 'receita', 'Receita de serviços'),
('Interest Income', 'receita', 'Receita de juros'),
('Other Income', 'receita', 'Outras receitas');
