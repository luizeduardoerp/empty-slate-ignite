
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useToast } from "@/hooks/use-toast";
import { SupplierForm } from "@/components/SupplierForm";
import { SupplierTable } from "@/components/SupplierTable";

export const Fornecedores = () => {
  const { toast } = useToast();
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSupplier = async (data: { fornecedor: string; pais_origem: string }) => {
    setIsSubmitting(true);
    try {
      await addSupplier(data);
      setIsDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Fornecedor adicionado com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar fornecedor",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async (data: { fornecedor: string; pais_origem: string }) => {
    if (editingSupplier) {
      setIsSubmitting(true);
      try {
        await updateSupplier(editingSupplier.id, data);
        setEditingSupplier(null);
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Fornecedor atualizado com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar fornecedor",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    setIsSubmitting(true);
    try {
      await deleteSupplier(supplierId);
      toast({
        title: "Sucesso",
        description: "Fornecedor removido com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover fornecedor",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewSupplier = () => {
    setEditingSupplier(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingSupplier(null);
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie seus fornecedores</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewSupplier}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        isSubmitting={isSubmitting}
      />

      <SupplierForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={editingSupplier ? handleSaveEdit : handleAddSupplier}
        supplier={editingSupplier}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
