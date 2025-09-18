
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  FolderOpen,
  Users,
  Building2,
  CreditCard,
  Receipt,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useCompanies, type Company } from "@/hooks/useCompanies";

const menuItems = [
  {
    group: "PRINCIPAL",
    items: [
      { title: "Dashboard", url: "/", icon: BarChart3 },
      { title: "Lançamentos", url: "/lancamentos", icon: TrendingUp },
      { title: "Tax Organizer", url: "/tax-organizer", icon: FileSpreadsheet },
      { title: "Relatório Semanal", url: "/relatorio-semanal", icon: Calendar },
    ]
  },
  {
    group: "CADASTROS",
    items: [
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Fornecedores", url: "/fornecedores", icon: Building2 },
      { title: "Categorias", url: "/categorias", icon: FolderOpen },
      { title: "Contas Bancárias", url: "/contas-bancarias", icon: CreditCard },
    ]
  },
  {
    group: "FATURAMENTO",
    items: [
      { title: "Invoices", url: "/invoices", icon: Receipt },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation();
  
  const { selectedCompany, setSelectedCompany, companies, addCompany, currentCompany } = useCompanies();
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    banco: ""
  });

  const handleAddCompany = () => {
    if (newCompany.name && newCompany.banco) {
      addCompany({ ...newCompany, email: "", cnpj: "", logo: "" });
      setNewCompany({ name: "", banco: "" });
      setShowAddCompany(false);
    }
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Company Selector */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="h-16 justify-start px-4">
                      <div className="flex items-center space-x-3 w-full">
                        {currentCompany?.logo ? (
                          <img 
                            src={currentCompany.logo} 
                            alt={currentCompany.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {currentCompany?.name?.charAt(0) || "D"}
                          </div>
                        )}
                        {!isCollapsed && (
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-sm truncate">{currentCompany?.name || "DUNEBI"}</div>
                            <ChevronDown className="w-3 h-3 mt-1" />
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="w-64 z-50"
                    side={isCollapsed ? "right" : "bottom"}
                  >
                    {companies.map((company) => (
                      <DropdownMenuItem 
                        key={company.id} 
                        onClick={() => setSelectedCompany(company)}
                        className={selectedCompany?.id === company.id ? "bg-muted" : ""}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          {company.logo ? (
                            <img 
                              src={company.logo} 
                              alt={company.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                              {company.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col flex-1">
                            <span className="font-medium">{company.name}</span>
                            {company.cnpj && <span className="text-xs text-muted-foreground">{company.cnpj}</span>}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Plus className="w-4 h-4 mr-2" />
                          {t('header.addCompany')}
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('header.addCompany')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Nome</Label>
                            <Input
                              placeholder="Digite o nome da conta..."
                              value={newCompany.name}
                              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Banco</Label>
                            <Select
                              value={newCompany.banco}
                              onValueChange={(value) => setNewCompany({ ...newCompany, banco: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o banco..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="banco-do-brasil">Banco do Brasil</SelectItem>
                                <SelectItem value="itau">Itaú</SelectItem>
                                <SelectItem value="bradesco">Bradesco</SelectItem>
                                <SelectItem value="santander">Santander</SelectItem>
                                <SelectItem value="caixa">Caixa Econômica Federal</SelectItem>
                                <SelectItem value="nubank">Nubank</SelectItem>
                                <SelectItem value="inter">Banco Inter</SelectItem>
                                <SelectItem value="original">Banco Original</SelectItem>
                                <SelectItem value="c6">C6 Bank</SelectItem>
                                <SelectItem value="next">Next</SelectItem>
                                <SelectItem value="banco-america">Bank of America</SelectItem>
                                <SelectItem value="chase">Chase Bank</SelectItem>
                                <SelectItem value="wells-fargo">Wells Fargo</SelectItem>
                                <SelectItem value="citibank">Citibank</SelectItem>
                                <SelectItem value="td-bank">TD Bank</SelectItem>
                                <SelectItem value="pnc">PNC Bank</SelectItem>
                                <SelectItem value="us-bank">U.S. Bank</SelectItem>
                                <SelectItem value="capital-one">Capital One</SelectItem>
                                <SelectItem value="ally">Ally Bank</SelectItem>
                                <SelectItem value="discover">Discover Bank</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button 
                              onClick={handleAddCompany} 
                              className="flex-1"
                              disabled={!newCompany.name || !newCompany.banco}
                            >
                              Salvar
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setNewCompany({ name: "", banco: "" });
                                setShowAddCompany(false);
                              }}
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => 
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive 
                              ? "bg-primary text-primary-foreground font-medium" 
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
