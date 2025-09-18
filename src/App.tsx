
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/components/LoginPage';
import { MainLayout } from '@/components/MainLayout';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { Clientes } from '@/pages/Clientes';
import { Usuarios } from '@/pages/Usuarios';
import { Fornecedores } from '@/pages/Fornecedores';
import { ContasBancarias } from '@/pages/ContasBancarias';
import { Transacoes } from '@/pages/Transacoes';
import { NovaTransacao } from '@/pages/NovaTransacao';
import { Categorias } from '@/pages/Categorias';
import NotFound from '@/pages/NotFound';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const handleLogin = () => {
    // Handle login logic here
    console.log('Login handled');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="fornecedores" element={<Fornecedores />} />
            <Route path="contas-bancarias" element={<ContasBancarias />} />
            <Route path="transacoes" element={<Transacoes />} />
            <Route path="lancamentos" element={<Transacoes />} />
            <Route path="nova-transacao" element={<NovaTransacao />} />
            <Route path="categorias" element={<Categorias />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
