
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { CategoryList } from "@/components/CategoryList";
import { CategoryForm } from "@/components/CategoryForm";
import { CategoryEditForm } from "@/components/CategoryEditForm";

export const Categorias = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'receita' | 'despesa'>('receita');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async (name: string, type: 'receita' | 'despesa') => {
    setIsSubmitting(true);
    try {
      await addCategory({
        nome: name,
        tipo: type
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Categoria adicionada com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar categoria",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (id: string, name: string) => {
    setIsSubmitting(true);
    try {
      await updateCategory(id, { nome: name });
      setEditingCategory(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsSubmitting(true);
    try {
      await deleteCategory(categoryId);
      toast({
        title: "Sucesso",
        description: "Categoria removida com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover categoria",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddDialog = (type: 'receita' | 'despesa') => {
    setDialogType(type);
    setIsAddDialogOpen(true);
  };

  const receitasCategories = categories.filter(cat => cat.tipo === 'receita');
  const despesasCategories = categories.filter(cat => cat.tipo === 'despesa');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{t('categories.title', 'Categorias')}</h1>
        <p className="text-muted-foreground">{t('categories.subtitle', 'Gerencie as categorias de receitas e despesas')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryList
          categories={receitasCategories}
          type="receita"
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onAdd={() => openAddDialog('receita')}
          isSubmitting={isSubmitting}
        />

        <CategoryList
          categories={despesasCategories}
          type="despesa"
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onAdd={() => openAddDialog('despesa')}
          isSubmitting={isSubmitting}
        />
      </div>

      <CategoryForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddCategory}
        type={dialogType}
        isSubmitting={isSubmitting}
      />

      <CategoryEditForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveEdit}
        category={editingCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
