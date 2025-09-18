
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Plus } from "lucide-react";
import { getCategoryTranslation } from "@/utils/categoryTranslations";

interface Category {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  descricao?: string;
}

interface CategoryListProps {
  categories: Category[];
  type: 'receita' | 'despesa';
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  isSubmitting: boolean;
}

export const CategoryList = ({ 
  categories, 
  type, 
  onEdit, 
  onDelete, 
  onAdd, 
  isSubmitting 
}: CategoryListProps) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const typeConfig = {
    receita: {
      title: t('categories.revenues', 'Receitas'),
      color: 'text-green-600',
      emptyMessage: t('categories.noRevenueCategories', 'Nenhuma categoria de receita cadastrada')
    },
    despesa: {
      title: t('categories.expenses', 'Despesas'),
      color: 'text-red-600',
      emptyMessage: t('categories.noExpenseCategories', 'Nenhuma categoria de despesa cadastrada')
    }
  };

  const config = typeConfig[type];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={config.color}>{config.title}</CardTitle>
        <Button size="sm" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {t('categories.newCategory', 'Nova Categoria')}
        </Button>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{config.emptyMessage}</p>
            <p className="text-sm">{t('categories.clickNewCategory', 'Clique em "Nova Categoria" para começar')}</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">
                  {getCategoryTranslation(category.nome, currentLanguage)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category)}
                    disabled={isSubmitting}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
