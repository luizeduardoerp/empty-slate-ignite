
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  descricao?: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('nome');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar categoria');
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => prev.map(cat => cat.id === id ? data : cat));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar categoria');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar categoria');
      throw err;
    }
  };

  const createDefaultIncomeCategories = async () => {
    const defaultIncomeCategories = [
      'Gross Receipts or Sales',
      '( - ) Returns and allowances',
      '( - ) Cost of goods sold',
      'Capital gain net income',
      'Other income'
    ];

    try {
      // Check if any income categories already exist
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('nome')
        .eq('tipo', 'receita');

      const existingNames = existingCategories?.map(cat => cat.nome) || [];
      const categoriesToCreate = defaultIncomeCategories.filter(name => !existingNames.includes(name));

      if (categoriesToCreate.length > 0) {
        const categoryInserts = categoriesToCreate.map(name => ({
          nome: name,
          tipo: 'receita' as const
        }));

        await supabase
          .from('categories')
          .insert(categoryInserts);
      }
    } catch (err) {
      console.error('Error creating default income categories:', err);
    }
  };

  useEffect(() => {
    const initializeCategories = async () => {
      await createDefaultIncomeCategories();
      await fetchCategories();
    };
    
    initializeCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
