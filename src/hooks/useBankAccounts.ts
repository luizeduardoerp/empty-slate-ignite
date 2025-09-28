
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BankAccount {
  id: string;
  nome: string;
  banco: string;
  tipo: string;
  agencia?: string;
  operacao?: string;
  numeroConta?: string;
  chavePix?: string;
  cnpj?: string;
  status: 'ativa' | 'inativa';
  created_at: string;
}

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('nome');

      if (error) throw error;
      setAccounts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contas bancárias');
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (account: Omit<BankAccount, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert([account])
        .select()
        .single();

      if (error) throw error;
      setAccounts(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar conta bancária');
      throw err;
    }
  };

  const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAccounts(prev => prev.map(account => account.id === id ? data : account));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar conta bancária');
      throw err;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar conta bancária');
      throw err;
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount,
    deleteAccount,
    refetch: fetchAccounts
  };
};
