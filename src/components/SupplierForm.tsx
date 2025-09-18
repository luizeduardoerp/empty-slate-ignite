
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { COUNTRIES } from "@/constants/countries";

interface Supplier {
  id: string;
  fornecedor: string;
  pais_origem: string;
}

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fornecedor: string; pais_origem: string }) => Promise<void>;
  supplier?: Supplier | null;
  isSubmitting: boolean;
}

export const SupplierForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  supplier, 
  isSubmitting 
}: SupplierFormProps) => {
  const [formData, setFormData] = useState({
    fornecedor: "",
    pais_origem: ""
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        fornecedor: supplier.fornecedor,
        pais_origem: supplier.pais_origem
      });
    } else {
      setFormData({ fornecedor: "", pais_origem: "" });
    }
  }, [supplier]);

  const handleSubmit = async () => {
    if (formData.fornecedor && formData.pais_origem && !isSubmitting) {
      await onSubmit(formData);
      setFormData({ fornecedor: "", pais_origem: "" });
    }
  };

  const handleCancel = () => {
    setFormData({ fornecedor: "", pais_origem: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Editar Fornecedor" : "Novo Fornecedor"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Fornecedor</Label>
            <Input
              placeholder="Digite o nome do fornecedor..."
              value={formData.fornecedor}
              onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label>País de Origem</Label>
            <Select 
              value={formData.pais_origem} 
              onValueChange={(value) => setFormData({ ...formData, pais_origem: value })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o país..." />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              disabled={!formData.fornecedor || !formData.pais_origem || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
