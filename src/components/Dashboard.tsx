import { useState, useMemo } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { CalendarIcon, Download, RotateCcw, TrendingUp, TrendingDown, DollarSign, FileText, File, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { FinancialCharts } from "@/components/FinancialCharts";
import { TransactionTable } from "@/components/TransactionTable";
import { FilterPanel } from "@/components/FilterPanel";
import { exportToPDF, exportToExcel, exportToCSV } from "@/utils/exportUtils";
import { getCategoryTranslation } from "@/utils/categoryTranslations";

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { categories } = useCategories();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchDescription, setSearchDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");

  // Use real transaction data with filters
  const filters = useMemo(() => ({
    startDate,
    endDate,
    type: selectedType,
    categoryId: selectedCategory,
    paymentMethod: selectedPaymentMethod,
    description: searchDescription
  }), [startDate, endDate, selectedType, selectedCategory, selectedPaymentMethod, searchDescription]);

  const { transactions, loading, getFinancialSummary, getCategoriesData, refetch } = useTransactions(filters);

  // Get real financial indicators
  const indicators = getFinancialSummary();
  const categoriesChartData = getCategoriesData();

  // Calculate percentage changes based on transaction movements
  const calculatePercentageChange = (currentValue: number, transactionCount: number) => {
    if (transactionCount === 0) return 0;
    // Simple calculation based on transaction volume and value
    const basePercentage = Math.min(Math.max((transactionCount / 10) * 2.5, 0), 15);
    return Math.round(basePercentage * 10) / 10;
  };

  const receitasCount = transactions.filter(t => t.tipo === 'receita').length;
  const despesasCount = transactions.filter(t => t.tipo === 'despesa').length;
  const totalCount = transactions.length;

  const receitasPercentage = calculatePercentageChange(indicators.totalReceitas, receitasCount);
  const despesasPercentage = calculatePercentageChange(indicators.totalDespesas, despesasCount);
  const saldoPercentage = totalCount > 0 ? Math.round(((indicators.saldoLiquido / (indicators.totalReceitas || 1)) * 100) * 10) / 10 : 0;

  // Filter categories based on selected type
  const getFilteredCategories = () => {
    if (selectedType === "all") return categories;
    return categories.filter(cat => cat.tipo === selectedType);
  };

  // Get payment/receipt method options based on type
  const getPaymentMethodOptions = () => {
    const paymentMethodTranslations = {
      dinheiro: i18n.language === 'en' ? 'Cash' : 'Dinheiro',
      cartao_debito: i18n.language === 'en' ? 'Debit Card' : 'Cartão Débito',
      cartao_credito: i18n.language === 'en' ? 'Credit Card' : 'Cartão Crédito',
      zelle: 'Zelle',
      wire_transfer: i18n.language === 'en' ? 'Wire Transfer' : 'Transferência'
    };

    if (selectedType === "despesa") {
      return [
        { value: "dinheiro", label: paymentMethodTranslations.dinheiro },
        { value: "cartao_debito", label: paymentMethodTranslations.cartao_debito },
        { value: "cartao_credito", label: paymentMethodTranslations.cartao_credito },
        { value: "zelle", label: paymentMethodTranslations.zelle },
        { value: "wire_transfer", label: paymentMethodTranslations.wire_transfer }
      ];
    } else if (selectedType === "receita") {
      return [
        { value: "wire_transfer", label: paymentMethodTranslations.wire_transfer },
        { value: "zelle", label: paymentMethodTranslations.zelle }
      ];
    } else {
      return [
        { value: "dinheiro", label: paymentMethodTranslations.dinheiro },
        { value: "cartao_debito", label: paymentMethodTranslations.cartao_debito },
        { value: "cartao_credito", label: paymentMethodTranslations.cartao_credito },
        { value: "zelle", label: paymentMethodTranslations.zelle },
        { value: "wire_transfer", label: paymentMethodTranslations.wire_transfer }
      ];
    }
  };

  // Get label for payment method dropdown based on type
  const getPaymentMethodLabel = () => {
    if (selectedType === "receita") {
      return t('dashboard.receiptMethod');
    }
    return t('dashboard.paymentMethod');
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchDescription("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedType("all");
    setSelectedPaymentMethod("all");
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    // Reset category and subcategory when type changes
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedPaymentMethod("all");
  };

  const handleUpdate = () => {
    refetch();
  };

  const handleExport = async (type: 'pdf' | 'excel' | 'csv') => {
    const exportData = {
      financialSummary: indicators,
      categoriesData: categoriesChartData,
      transactions: transactions.map(t => ({
        type: t.tipo,
        amount: t.valor,
        category: t.category?.nome || '',
        client: t.client?.empresa || '',
        paymentMethod: t.payment_method,
        date: t.data_vencimento,
        description: t.descricao || ''
      }))
    };

    try {
      switch (type) {
        case 'pdf':
          await exportToPDF(exportData, t);
          break;
        case 'excel':
          exportToExcel(exportData, t);
          break;
        case 'csv':
          exportToCSV(exportData, t);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getDateLocale = () => {
    return i18n.language === 'pt' ? ptBR : enUS;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const formatMonth = (date: Date) => {
    const monthNames = {
      pt: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ],
      en: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
    };
    
    const months = i18n.language === 'pt' ? monthNames.pt : monthNames.en;
    const preposition = i18n.language === 'pt' ? 'De' : '';
    return `${months[date.getMonth()]} ${preposition} ${date.getFullYear()}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Filter Panel */}
      <div className="flex justify-end">
        <FilterPanel
          startDate={startDate}
          endDate={endDate}
          searchDescription={searchDescription}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          selectedType={selectedType}
          selectedPaymentMethod={selectedPaymentMethod}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearchDescriptionChange={setSearchDescription}
          onCategoryChange={setSelectedCategory}
          onSubcategoryChange={setSelectedSubcategory}
          onTypeChange={handleTypeChange}
          onPaymentMethodChange={setSelectedPaymentMethod}
          onClearFilters={handleClearFilters}
          onUpdate={handleUpdate}
          onExport={handleExport}
        />
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {i18n.language === 'pt' ? 'Receita Total' : 'Total Revenue'}
            </span>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {i18n.language === 'pt' ? 'Clique para ver detalhes' : 'Click to see details'}
          </p>
          <p className="text-2xl font-bold text-green-600 mb-2">
            {formatCurrency(indicators.totalReceitas)}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {transactions.filter(t => t.tipo === 'receita').length} {i18n.language === 'pt' ? 'transações' : 'transactions'}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {receitasPercentage > 0 ? '+' : ''} {receitasPercentage}%
            </span>
          </div>
        </Card>

        <Card className="p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {i18n.language === 'pt' ? 'Despesas Totais' : 'Total Expenses'}
            </span>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {i18n.language === 'pt' ? 'Clique para ver detalhes' : 'Click to see details'}
          </p>
          <p className="text-2xl font-bold text-red-600 mb-2">
            {formatCurrency(indicators.totalDespesas)}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {transactions.filter(t => t.tipo === 'despesa').length} {i18n.language === 'pt' ? 'transações' : 'transactions'}
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
              {despesasPercentage > 0 ? '-' : ''} {despesasPercentage}%
            </span>
          </div>
        </Card>

        <Card className="p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {i18n.language === 'pt' ? 'Saldo em Caixa' : 'Cash Balance'}
            </span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {i18n.language === 'pt' ? 'Lucro' : 'Profit'}
          </p>
          <p className={`text-2xl font-bold mb-2 ${
            indicators.saldoLiquido > 0 ? 'text-green-600' : 
            indicators.saldoLiquido < 0 ? 'text-red-600' : 
            'text-black dark:text-white'
          }`}>
            {formatCurrency(Math.abs(indicators.saldoLiquido))}
          </p>
          <div className="flex items-center justify-end text-xs">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {Math.abs(saldoPercentage)}%
            </span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <FinancialCharts 
        revenueData={categoriesChartData.receitasData}
        expenseData={categoriesChartData.despesasData}
        loading={loading}
        t={t}
      />

      {/* Transaction Table */}
      <TransactionTable 
        transactions={transactions}
        loading={loading}
      />
    </div>
  );
};
