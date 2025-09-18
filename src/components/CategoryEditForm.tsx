
import { useState, useEffect } from "react";
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

interface Category {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  descricao?: string;
}

interface CategoryEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string) => Promise<void>;
  category: Category | null;
  isSubmitting: boolean;
}

export const CategoryEditForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  category, 
  isSubmitting 
}: CategoryEditFormProps) => {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.nome);
    }
  }, [category]);

  const handleSubmit = async () => {
    if (category && categoryName.trim() && !isSubmitting) {
      await onSave(category.id, categoryName.trim());
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
          <DialogTitle>{t('categories.editCategory', 'Editar Categoria')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('categories.categoryName', 'Nome da Categoria')}</Label>
            <Input
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
