
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { useToast } from "@/hooks/use-toast";

export const ContasBancarias = () => {
  const { toast } = useToast();
  const { accounts, loading, addAccount, updateAccount, deleteAccount } = useBankAccounts();
  
  const [formData, setFormData] = useState({
    nome: "",
    banco: "",
    tipo: "",
    zelle: "",
    status: "ativa" as 'ativa' | 'inativa'
  });
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const banks = [
    "Bank of America",
    "Wells Fargo",
    "Chase Bank",
    "Citibank",
    "Capital One",
    "PNC Bank",
    "TD Bank",
    "US Bank",
    "Truist Bank",
    "Fifth Third Bank"
  ];

  const accountTypes = [
    "Conta Corrente",
    "Conta Poupança",
    "Conta Empresarial",
    "Conta de Investimento"
  ];

  const handleAddAccount = async () => {
    if (formData.nome && formData.banco && formData.tipo && formData.zelle && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await addAccount({
          nome: formData.nome,
          banco: formData.banco,
          tipo: formData.tipo,
          zelle: formData.zelle,
          status: formData.status
        });
        setFormData({ nome: "", banco: "", tipo: "", zelle: "", status: "ativa" });
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Conta bancária adicionada com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao adicionar conta bancária",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setFormData({
      nome: account.nome,
      banco: account.banco,
      tipo: account.tipo,
      zelle: account.zelle,
      status: account.status
    });
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingAccount && formData.nome && formData.banco && formData.tipo && formData.zelle && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await updateAccount(editingAccount.id, {
          nome: formData.nome,
          banco: formData.banco,
          tipo: formData.tipo,
          zelle: formData.zelle,
          status: formData.status
        });
        setFormData({ nome: "", banco: "", tipo: "", zelle: "", status: "ativa" });
        setEditingAccount(null);
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Conta bancária atualizada com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar conta bancária",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await deleteAccount(accountId);
        toast({
          title: "Sucesso",
          description: "Conta bancária removida com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover conta bancária",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingAccount(null);
    setFormData({ nome: "", banco: "", tipo: "", zelle: "", status: "ativa" });
    setIsDialogOpen(false);
  };

  const isFormValid = formData.nome && formData.banco && formData.tipo && formData.zelle;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contas Bancárias</h1>
          <p className="text-muted-foreground">Gerencie suas contas bancárias</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAccount(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta Bancária
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? "Editar Conta Bancária" : "Nova Conta Bancária"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Digite o nome da conta..."
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label>Banco</Label>
                <Select 
                  value={formData.banco} 
                  onValueChange={(value) => setFormData({ ...formData, banco: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco..." />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Zelle</Label>
                <Input
                  placeholder="Email ou telefone para Zelle..."
                  value={formData.zelle}
                  onChange={(e) => setFormData({ ...formData, zelle: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'ativa' | 'inativa') => setFormData({ ...formData, status: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="inativa">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingAccount ? handleSaveEdit : handleAddAccount}
                  className="flex-1"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Conta"
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
      </div>

      {/* Tabela de Contas Bancárias */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas Bancárias ({accounts.length} itens)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Zelle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.nome}</TableCell>
                  <TableCell>{account.banco}</TableCell>
                  <TableCell>{account.tipo}</TableCell>
                  <TableCell className="text-purple-600 font-medium">{account.zelle}</TableCell>
                  <TableCell>
                    <Badge variant={account.status === "ativa" ? "default" : "secondary"}>
                      {account.status === "ativa" ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditAccount(account)}
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
