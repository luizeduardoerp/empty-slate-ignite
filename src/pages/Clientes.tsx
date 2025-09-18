
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";

export const Clientes = () => {
  const { toast } = useToast();
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    empresa: "",
    email: "",
    telefone: "",
    cpf_cnpj: ""
  });
  const [editingClient, setEditingClient] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredClients = clients.filter(client =>
    client.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf_cnpj.includes(searchTerm)
  );

  const handleAddClient = async () => {
    if (formData.empresa && formData.email && formData.telefone && formData.cpf_cnpj && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await addClient({
          empresa: formData.empresa,
          email: formData.email,
          telefone: formData.telefone,
          cpf_cnpj: formData.cpf_cnpj,
          status: "ativo"
        });
        setFormData({ empresa: "", email: "", telefone: "", cpf_cnpj: "" });
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Cliente adicionado com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao adicionar cliente",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setFormData({
      empresa: client.empresa,
      email: client.email,
      telefone: client.telefone,
      cpf_cnpj: client.cpf_cnpj
    });
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingClient && formData.empresa && formData.email && formData.telefone && formData.cpf_cnpj && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await updateClient(editingClient.id, {
          empresa: formData.empresa,
          email: formData.email,
          telefone: formData.telefone,
          cpf_cnpj: formData.cpf_cnpj
        });
        setFormData({ empresa: "", email: "", telefone: "", cpf_cnpj: "" });
        setEditingClient(null);
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar cliente",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await deleteClient(clientId);
        toast({
          title: "Sucesso",
          description: "Cliente removido com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover cliente",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ empresa: "", email: "", telefone: "", cpf_cnpj: "" });
    setEditingClient(null);
    setIsDialogOpen(false);
  };

  const isFormValid = formData.empresa && formData.email && formData.telefone && formData.cpf_cnpj;

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
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingClient(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Empresa *</Label>
                <Input
                  placeholder="Digite o nome da empresa..."
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  placeholder="contato@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone *</Label>
                <Input
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label>CPF/CNPJ *</Label>
                <Input
                  placeholder="12.345.678/0001-90"
                  value={formData.cpf_cnpj}
                  onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingClient ? handleSaveEdit : handleAddClient}
                  className="flex-1"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    editingClient ? "Salvar Alterações" : "Salvar Cliente"
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email, CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes ({filteredClients.length} itens)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.empresa}</div>
                      <div className="text-sm text-muted-foreground">{client.cpf_cnpj}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.status === "ativo" ? "default" : "secondary"}>
                      {client.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{client.email}</div>
                      <div className="text-sm text-muted-foreground">{client.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClient(client)}
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
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
