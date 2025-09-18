import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Download, RotateCcw, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useClients } from "@/hooks/useClients";
import { getCategoryTranslation } from "@/utils/categoryTranslations";
import { exportToPDF, exportToExcel, exportToCSV } from "@/utils/exportUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TransactionTable } from "@/components/TransactionTable";

export const Transacoes = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchDescription, setSearchDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  
  // Form states
  const [transactionType, setTransactionType] = useState("receita");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");
  const [client, setClient] = useState("");
  const [value, setValue] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  // Hooks
  const { transactions, loading, refetch, getFinancialSummary, getCategoriesData } = useTransactions({
    startDate,
    endDate,
    type: selectedType,
    categoryId: selectedCategory,
    paymentMethod: selectedPaymentMethod,
    description: searchDescription
  });
  const { categories } = useCategories();
  const { clients } = useClients();

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchDescription("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedPaymentMethod("all");
    refetch();
  };

  const handleUpdate = () => {
    refetch();
    toast.success("Transações atualizadas");
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    const summary = getFinancialSummary();
    const categoryData = getCategoriesData();
    
    const exportData = {
      financialSummary: summary,
      categoriesData: {
        receitasData: categoryData.receitasData,
        despesasData: categoryData.despesasData
      },
      transactions: transactions.map(t => ({
        tipo: t.tipo,
        data: t.data_vencimento,
        cliente: t.client?.empresa || '-',
        categoria: t.category?.nome || '-',
        valor: t.valor,
        pagamento: t.payment_method,
        descricao: t.descricao || '-'
      }))
    };

    try {
      if (format === 'pdf') {
        exportToPDF(exportData, (key: string) => key);
      } else if (format === 'excel') {
        exportToExcel(exportData, (key: string) => key);
      } else {
        exportToCSV(exportData, (key: string) => key);
      }
      toast.success(`Relatório exportado em ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Erro ao exportar relatório");
    }
  };

  const handleSaveTransaction = async () => {
    if (!dueDate || !value || !paymentMethod) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          tipo: transactionType,
          valor: parseFloat(value.replace(/[^\d.-]/g, '')),
          categoria_id: category || null,
          client_id: client || null,
          payment_method: paymentMethod,
          data_vencimento: dueDate.toISOString().split('T')[0],
          descricao: description || null,
          status: 'pendente'
        });

      if (error) throw error;
      
      toast.success("Transação salva com sucesso");
      handleClearForm();
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar transação");
    }
  };

  const handleClearForm = () => {
    setTransactionType("receita");
    setPaymentMethod("");
    setCategory("");
    setClient("");
    setValue("");
    setDueDate(undefined);
    setDescription("");
    setAttachment(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Transação excluída com sucesso");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir transação");
    }
  };

  const getPaymentMethodOptions = () => {
    const paymentMethodTranslations = {
      dinheiro: i18n.language === 'en' ? 'Cash' : 'Dinheiro',
      cartao_debito: i18n.language === 'en' ? 'Debit Card' : 'Cartão de Débito',
      cartao_credito: i18n.language === 'en' ? 'Credit Card' : 'Cartão de Crédito',
      zelle: 'Zelle 💜',
      wire_transfer: i18n.language === 'en' ? 'Wire Transfer' : 'Transferência'
    };

    if (transactionType === "despesa") {
      return [
        { value: "dinheiro", label: paymentMethodTranslations.dinheiro },
        { value: "cartao_debito", label: paymentMethodTranslations.cartao_debito },
        { value: "cartao_credito", label: paymentMethodTranslations.cartao_credito },
        { value: "zelle", label: paymentMethodTranslations.zelle },
        { value: "wire_transfer", label: paymentMethodTranslations.wire_transfer },
      ];
    } else {
      return [
        { value: "wire_transfer", label: paymentMethodTranslations.wire_transfer },
        { value: "zelle", label: paymentMethodTranslations.zelle },
      ];
    }
  };

  const getFilteredCategories = () => {
    return categories.filter(cat => 
      selectedType === 'all' || cat.tipo === selectedType
    );
  };

  const financialSummary = getFinancialSummary();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lançamentos</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/nova-transacao')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova transação
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-green-700 mb-1">RECEITAS</div>
            <div className="text-2xl font-bold text-green-700">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(financialSummary.totalReceitas)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-red-700 mb-1">DESPESAS</div>
            <div className="text-2xl font-bold text-red-700">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(financialSummary.totalDespesas)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-blue-700 mb-1">SALDO</div>
            <div className={`text-2xl font-bold ${financialSummary.saldoLiquido >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(financialSummary.saldoLiquido)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">LANÇAMENTOS DO MÊS</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    Exportar PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    Exportar Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Exportar CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Descrição..."
                value={searchDescription}
                onChange={(e) => setSearchDescription(e.target.value)}
              />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Transaction Table using existing TransactionTable component */}
      <div className="border rounded-lg">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold">Lançamentos</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Descrição</TableHead>
                  <TableHead className="font-semibold">Categoria</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Método</TableHead>
                  <TableHead className="font-semibold text-right">Valor</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const formatPaymentMethod = (method: string) => {
                    const methods: Record<string, string> = {
                      dinheiro: 'Dinheiro',
                      cartao_debito: 'Cartão de Débito',
                      cartao_credito: 'Cartão de Crédito',
                      zelle: 'Zelle',
                      wire_transfer: 'Transferência'
                    };
                    return methods[method] || method;
                  };

                  const getStatusBadge = (status: string) => {
                    const statusConfig = {
                      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
                      paid: { label: 'Pago', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
                      overdue: { label: 'Vencido', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
                    };
                    return statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-100 text-gray-700' };
                  };

                  const statusBadge = getStatusBadge(transaction.status);

                  return (
                    <TableRow key={transaction.id} className="hover:bg-muted/30">
                      <TableCell>
                        <Badge className={transaction.tipo === 'receita' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                          : 'bg-red-100 text-red-700 hover:bg-red-100'
                        }>
                          {transaction.tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(transaction.data_vencimento), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate text-sm">
                          {transaction.descricao || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {transaction.category ? getCategoryTranslation(transaction.category.nome, i18n.language) : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {transaction.client?.empresa || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatPaymentMethod(transaction.payment_method)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <span className={transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.tipo === 'despesa' ? '-' : ''}
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(transaction.valor)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-center">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};