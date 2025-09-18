
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  categoria_id?: string;
  client_id?: string;
  bank_account_id?: string;
  payment_method: string;
  data_vencimento: string;
  descricao?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TransactionWithDetails extends Transaction {
  category?: {
    id: string;
    nome: string;
    tipo: string;
  };
  client?: {
    id: string;
    empresa: string;
  };
}

export const useTransactions = (filters?: {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  categoryId?: string;
  paymentMethod?: string;
  description?: string;
}) => {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories!categoria_id (id, nome, tipo),
          clients!client_id (id, empresa)
        `)
        .order('data_vencimento', { ascending: false });

      // Apply filters
      if (filters?.startDate) {
        query = query.gte('data_vencimento', filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        query = query.lte('data_vencimento', filters.endDate.toISOString().split('T')[0]);
      }
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('tipo', filters.type);
      }
      if (filters?.categoryId && filters.categoryId !== 'all') {
        query = query.eq('categoria_id', filters.categoryId);
      }
      if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
        query = query.eq('payment_method', filters.paymentMethod);
      }
      if (filters?.description) {
        query = query.ilike('descricao', `%${filters.description}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const getFinancialSummary = () => {
    const totalReceitas = transactions
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + Number(t.valor), 0);
    
    const totalDespesas = transactions
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + Number(t.valor), 0);
    
    const saldoLiquido = totalReceitas - totalDespesas;

    return { totalReceitas, totalDespesas, saldoLiquido };
  };

  const getCategoriesData = () => {
    const receitasData = transactions
      .filter(t => t.tipo === 'receita' && t.category)
      .reduce((acc, t) => {
        const categoryName = t.category!.nome;
        acc[categoryName] = (acc[categoryName] || 0) + Number(t.valor);
        return acc;
      }, {} as Record<string, number>);

    const despesasData = transactions
      .filter(t => t.tipo === 'despesa' && t.category)
      .reduce((acc, t) => {
        const categoryName = t.category!.nome;
        acc[categoryName] = (acc[categoryName] || 0) + Number(t.valor);
        return acc;
      }, {} as Record<string, number>);

    return { receitasData, despesasData };
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters?.startDate, filters?.endDate, filters?.type, filters?.categoryId, filters?.paymentMethod, filters?.description]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    getFinancialSummary,
    getCategoriesData
  };
};
