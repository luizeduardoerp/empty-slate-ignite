
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: 'receita' | 'despesa') => Promise<void>;
  type: 'receita' | 'despesa';
  isSubmitting: boolean;
}

export const CategoryForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type, 
  isSubmitting 
}: CategoryFormProps) => {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async () => {
    if (categoryName.trim() && !isSubmitting) {
      await onSubmit(categoryName.trim(), type);
      setCategoryName("");
    }
  };

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'receita' 
              ? t('categories.newRevenueCategory', 'Nova Categoria de Receita')
              : t('categories.newExpenseCategory', 'Nova Categoria de Despesa')
            }
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('categories.categoryName', 'Nome da Categoria')}</Label>
            <Input
              placeholder={t('categories.enterCategoryName', 'Digite o nome da categoria...')}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={isSubmitting || !categoryName.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.saving', 'Salvando...')}
                </>
              ) : (
                t('common.save', 'Salvar')
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
