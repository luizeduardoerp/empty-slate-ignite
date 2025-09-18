
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, RotateCcw, UserPlus, Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useToast } from "@/hooks/use-toast";

export const Usuarios = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { users, loading, addUser, updateUser, deleteUser, refetch } = useUsers();
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    nivel_acesso: "" as 'administrador' | 'financeiro' | 'visualizador' | ""
  });
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accessLevels = [
    { value: 'administrador', label: t('users.administrator') },
    { value: 'financeiro', label: t('users.financial') },
    { value: 'visualizador', label: t('users.viewer') }
  ];

  const handleAddUser = async () => {
    if (formData.nome && formData.email && formData.nivel_acesso !== "" && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await addUser({
          nome: formData.nome,
          email: formData.email,
          nivel_acesso: formData.nivel_acesso as 'administrador' | 'financeiro' | 'visualizador'
        });
        setFormData({ nome: "", email: "", nivel_acesso: "" });
        toast({
          title: "Sucesso",
          description: "Usuário adicionado com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao adicionar usuário",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      nivel_acesso: user.nivel_acesso
    });
  };

  const handleSaveEdit = async () => {
    if (editingUser && formData.nome && formData.email && formData.nivel_acesso !== "" && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await updateUser(editingUser.id, {
          nome: formData.nome,
          email: formData.email,
          nivel_acesso: formData.nivel_acesso as 'administrador' | 'financeiro' | 'visualizador'
        });
        setEditingUser(null);
        setFormData({ nome: "", email: "", nivel_acesso: "" });
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar usuário",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveUser = async (id: string) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await deleteUser(id);
        toast({
          title: "Sucesso",
          description: "Usuário removido com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover usuário",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ nome: "", email: "", nivel_acesso: "" });
  };

  const handleClearForm = () => {
    setFormData({ nome: "", email: "", nivel_acesso: "" });
  };

  const getAccessLevelBadge = (level: string) => {
    const variants = {
      'administrador': 'destructive',
      'financeiro': 'default',
      'visualizador': 'secondary'
    };
    return variants[level as keyof typeof variants] || 'default';
  };

  const isFormValid = formData.nome && formData.email && formData.nivel_acesso !== "";

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
          <h1 className="text-2xl font-bold">{t('users.title')}</h1>
          <p className="text-muted-foreground">{t('users.subtitle')}</p>
        </div>
        <Button onClick={refetch} disabled={isSubmitting}>
          <RotateCcw className="mr-2 h-4 w-4" />
          {t('dashboard.update')}
        </Button>
      </div>

      {/* Formulário de usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {editingUser ? t('users.edit') : (users.length === 0 ? t('users.addUser') : t('users.newUser'))}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">{t('users.name')}</Label>
              <Input
                id="nome"
                placeholder={t('users.name')}
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('users.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('users.email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('users.accessLevel')}</Label>
              <Select 
                value={formData.nivel_acesso} 
                onValueChange={(value) => setFormData({ ...formData, nivel_acesso: value as any })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('users.accessLevel')} />
                </SelectTrigger>
                <SelectContent>
                  {accessLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={editingUser ? handleSaveEdit : handleAddUser}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                editingUser ? t('common.save') : t('users.saveUser')
              )}
            </Button>
            <Button variant="outline" onClick={handleClearForm} disabled={isSubmitting}>
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('dashboard.clearFilters')}
            </Button>
            {editingUser && (
              <Button variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('users.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('users.name')}</TableHead>
                  <TableHead>{t('users.email')}</TableHead>
                  <TableHead>{t('users.accessLevel')}</TableHead>
                  <TableHead>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getAccessLevelBadge(user.nivel_acesso) as any}>
                        {t(`users.accessLevels.${user.nivel_acesso}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          disabled={isSubmitting}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
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
      )}
    </div>
  );
};
