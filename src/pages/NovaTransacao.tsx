import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ArrowLeft, Upload, DollarSign, Hash, FileText, TrendingUp, TrendingDown, Send, Banknote, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { useClients } from "@/hooks/useClients";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { getCategoryTranslation } from "@/utils/categoryTranslations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NovaTransacao = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  // Form states
  const [transactionType, setTransactionType] = useState("receita");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedBankAccount, setSelectedBankAccount] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [client, setClient] = useState("");
  const [value, setValue] = useState("");
  const [installments, setInstallments] = useState("1");
  const [dueDate, setDueDate] = useState<Date>();
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [issueDate, setIssueDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [complementaryInfo, setComplementaryInfo] = useState("");

  // Hooks
  const { categories } = useCategories();
  const { clients } = useClients();
  const { accounts: bankAccounts } = useBankAccounts();

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
      navigate('/lancamentos');
    } catch (error) {
      toast.error("Erro ao salvar transação");
    }
  };

  const handleCancel = () => {
    navigate('/lancamentos');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Nova Transação</h1>
            <p className="text-sm text-gray-600">Adicione uma nova receita ou despesa ao sistema</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header without background */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-medium text-gray-800">Nova Transação</h2>
            </div>
          </div>

          <div className="p-6">
            {/* Dados Principais */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-4">Dados Principais</h3>
              
              {/* Transaction Type Buttons */}
              <div className="flex gap-2 mb-6">
                <Button
                  type="button"
                  variant={transactionType === "receita" ? "default" : "outline"}
                  className={`flex-1 ${transactionType === "receita" ? "bg-green-500 hover:bg-green-600 text-white" : "text-gray-600 border-gray-300"}`}
                  onClick={() => setTransactionType("receita")}
                >
                  <TrendingUp className="h-4 w-4 mr-2 text-white" />
                  Receita
                </Button>
                <Button
                  type="button"
                  variant={transactionType === "despesa" ? "default" : "outline"}
                  className={`flex-1 font-bold ${transactionType === "despesa" ? "bg-red-500 hover:bg-red-600 text-white" : "text-gray-600 border-gray-300"}`}
                  onClick={() => setTransactionType("despesa")}
                >
                  <TrendingDown className="h-4 w-4 mr-2 text-white" />
                  Despesa
                </Button>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <Label className="text-sm text-gray-700 mb-2 block">
                  {transactionType === "receita" ? "Forma de Recebimento *" : "Forma de Pagamento *"}
                </Label>
                
                {/* Payment Method Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {transactionType === "receita" ? (
                    <>
                      {/* Zelle */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-purple-600 text-white ${
                          paymentMethod === "zelle" 
                            ? "border-purple-700 ring-2 ring-purple-300" 
                            : "border-purple-600 hover:border-purple-700"
                        }`}
                        onClick={() => setPaymentMethod("zelle")}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-xl">Z</span>
                          </div>
                          <span className="text-sm font-medium text-white">Zelle</span>
                        </div>
                      </div>

                      {/* Electronic Transfer */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-blue-600 text-white ${
                          paymentMethod === "electronic_transfer" 
                            ? "border-blue-700 ring-2 ring-blue-300" 
                            : "border-blue-600 hover:border-blue-700"
                        }`}
                        onClick={() => setPaymentMethod("electronic_transfer")}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                            <Send className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">Electronic Transfer</span>
                        </div>
                      </div>

                      {/* Cash */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-green-600 text-white ${
                          paymentMethod === "cash" 
                            ? "border-green-700 ring-2 ring-green-300" 
                            : "border-green-600 hover:border-green-700"
                        }`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                            <Banknote className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">Cash</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Zelle */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-purple-600 text-white ${
                          paymentMethod === "zelle" 
                            ? "border-purple-700 ring-2 ring-purple-300" 
                            : "border-purple-600 hover:border-purple-700"
                        }`}
                        onClick={() => setPaymentMethod("zelle")}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-xl">Z</span>
                          </div>
                          <span className="text-sm font-medium text-white">Zelle</span>
                        </div>
                      </div>

                      {/* Electronic Transfer */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-blue-600 text-white ${
                          paymentMethod === "electronic_transfer" 
                            ? "border-blue-700 ring-2 ring-blue-300" 
                            : "border-blue-600 hover:border-blue-700"
                        }`}
                        onClick={() => setPaymentMethod("electronic_transfer")}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                            <Send className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">Electronic Transfer</span>
                        </div>
                      </div>

                      {/* Cash */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-green-600 text-white ${
                          paymentMethod === "cash" 
                            ? "border-green-700 ring-2 ring-green-300" 
                            : "border-green-600 hover:border-green-700"
                        }`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                            <Banknote className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">Cash</span>
                        </div>
                      </div>

                      {/* Debit Card */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-red-600 text-white ${
                          paymentMethod === "debit_card" 
                            ? "border-red-700 ring-2 ring-red-300" 
                            : "border-red-600 hover:border-red-700"
                        }`}
                        onClick={() => setPaymentMethod("debit_card")}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                            <CreditCard className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">Debit Card</span>
                        </div>
                      </div>

                      {/* Credit Card */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-orange-600 text-white ${
                          paymentMethod === "credit_card" 
                            ? "border-orange-700 ring-2 ring-orange-300" 
                            : "border-orange-600 hover:border-orange-700"
                        }`}
                        onClick={() => setPaymentMethod("credit_card")}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                            <CreditCard className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">Credit Card</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Category and Client Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="C.01 - Receita de Vendas e Serviços" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter(cat => transactionType === 'receita' ? cat.tipo === 'receita' : cat.tipo === 'despesa')
                        .map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {getCategoryTranslation(cat.nome, i18n.language)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">Subcategoria</Label>
                  <Select value={subcategory} onValueChange={setSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="C.01.001 - Receita de Serviços" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geral">C.01.001 - Receita de Serviços</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Client field for receita */}
              {transactionType === "receita" && (
                <div className="mb-6">
                  <Label className="text-sm text-gray-700 mb-2 block">Cliente</Label>
                  <Select value={client} onValueChange={setClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(clientItem => (
                        <SelectItem key={clientItem.id} value={clientItem.id}>
                          {clientItem.empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Detalhes da Transação */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-800 mb-4">Detalhes da Transação</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">Descrição</Label>
                  <Input
                    placeholder="Descrição da transação..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Valor (R$) *</Label>
                    <Input
                      placeholder="R$ 0,00"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Contas bancárias</Label>
                    <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione conta bancária..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.nome} - {account.banco}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Data de Registro</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "dd/MM/yyyy") : "15/09/2025"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Data de Vencimento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !paymentDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {paymentDate ? format(paymentDate, "dd/MM/yyyy") : "15/09/2025"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={paymentDate}
                          onSelect={setPaymentDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Data de Pagamento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !issueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {issueDate ? format(issueDate, "dd/MM/yyyy") : "dd/mm/aaaa"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={issueDate}
                          onSelect={setIssueDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Complementares */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-800 mb-4">Informações Complementares</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">Anexo (Opcional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      ARRASTE UM ARQUIVO AQUI OU CLIQUE PARA SELECIONAR
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG ou PDF até 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleSaveTransaction} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Salvar Transação
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};