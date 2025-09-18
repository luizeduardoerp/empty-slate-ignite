import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { CalendarIcon, Filter, RotateCcw, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

interface FilterPanelProps {
  startDate?: Date;
  endDate?: Date;
  searchDescription: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedType: string;
  selectedPaymentMethod: string;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
  onSearchDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onClearFilters: () => void;
  onUpdate: () => void;
  onExport: (type: 'pdf' | 'excel' | 'csv') => void;
}

export const FilterPanel = ({
  startDate,
  endDate,
  searchDescription,
  selectedCategory,
  selectedSubcategory,
  selectedType,
  selectedPaymentMethod,
  onStartDateChange,
  onEndDateChange,
  onSearchDescriptionChange,
  onCategoryChange,
  onSubcategoryChange,
  onTypeChange,
  onPaymentMethodChange,
  onClearFilters,
  onUpdate,
  onExport
}: FilterPanelProps) => {
  const { t, i18n } = useTranslation();
  const { categories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const getDateLocale = () => {
    return i18n.language === 'pt' ? ptBR : enUS;
  };

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
      return i18n.language === 'pt' ? 'Forma de Recebimento' : 'Receipt Method';
    }
    return i18n.language === 'pt' ? 'Forma de Pagamento' : 'Payment Method';
  };

  const hasActiveFilters = startDate || endDate || searchDescription || 
    selectedCategory !== "all" || selectedSubcategory !== "all" || 
    selectedType !== "all" || selectedPaymentMethod !== "all";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {hasActiveFilters 
            ? (i18n.language === 'pt' ? 'Filtros Ativos' : 'Active Filters')
            : (i18n.language === 'pt' ? 'Filtros' : 'Filters')
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              {i18n.language === 'pt' ? 'Filtros' : 'Filters'}
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm">
                {i18n.language === 'pt' ? 'Data Inicial' : 'Start Date'}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-xs",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "01/01/2025"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={onStartDateChange}
                    locale={getDateLocale()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-sm">
                {i18n.language === 'pt' ? 'Data Final' : 'End Date'}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-xs",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "30/09/2025"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={onEndDateChange}
                    locale={getDateLocale()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <Label className="text-sm">
              {i18n.language === 'pt' ? 'Tipo' : 'Type'}
            </Label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder={i18n.language === 'pt' ? 'Todos os tipos' : 'All types'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {i18n.language === 'pt' ? 'Todos os tipos' : 'All types'}
                </SelectItem>
                <SelectItem value="receita">
                  {i18n.language === 'pt' ? 'Receita' : 'Revenue'}
                </SelectItem>
                <SelectItem value="despesa">
                  {i18n.language === 'pt' ? 'Despesa' : 'Expense'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div>
            <Label className="text-sm">
              {i18n.language === 'pt' ? 'Buscar' : 'Search'}
            </Label>
            <Input
              placeholder={i18n.language === 'pt' ? 'Digite para buscar...' : 'Type to search...'}
              value={searchDescription}
              onChange={(e) => onSearchDescriptionChange(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm">
                {i18n.language === 'pt' ? 'Categoria' : 'Category'}
              </Label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder={i18n.language === 'pt' ? 'Todas as categorias' : 'All categories'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {i18n.language === 'pt' ? 'Todas as categorias' : 'All categories'}
                  </SelectItem>
                  {getFilteredCategories().map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">
                {i18n.language === 'pt' ? 'Subcategoria' : 'Subcategory'}
              </Label>
              <Select value={selectedSubcategory} onValueChange={onSubcategoryChange}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder={i18n.language === 'pt' ? 'Todas as subcategorias' : 'All subcategories'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {i18n.language === 'pt' ? 'Todas as subcategorias' : 'All subcategories'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-sm">
              {getPaymentMethodLabel()}
            </Label>
            <Select value={selectedPaymentMethod} onValueChange={onPaymentMethodChange}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder={i18n.language === 'pt' ? 'Todas as formas' : 'All methods'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {i18n.language === 'pt' ? 'Todas as formas' : 'All methods'}
                </SelectItem>
                {getPaymentMethodOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="gap-1 text-xs"
            >
              <X className="h-3 w-3" />
              {i18n.language === 'pt' ? 'Limpar' : 'Clear'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onUpdate}
              className="gap-1 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              {i18n.language === 'pt' ? 'Atualizar' : 'Update'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onExport('pdf')}
              className="gap-1 text-xs"
            >
              <Download className="h-3 w-3" />
              {i18n.language === 'pt' ? 'Exportar' : 'Export'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};