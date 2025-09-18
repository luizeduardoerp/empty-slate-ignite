
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      // Header
      "header.addCompany": "Adicionar Empresa",
      "header.companyName": "Nome da Empresa",
      "header.cnpj": "CNPJ (opcional)",
      "header.adminEmail": "E-mail Administrativo",
      "header.save": "Salvar",
      "header.cancel": "Cancelar",
      "header.myProfile": "Meu Perfil",
      "header.accountSettings": "Configurações da Conta",
      "header.logout": "Sair",
      "header.portuguese": "Português (Brasil)",
      "header.english": "Inglês (Americano)",
      
      // Sidebar
      "sidebar.main": "PRINCIPAL",
      "sidebar.dashboard": "Dashboard",
      "sidebar.financial": "FINANCEIRO",
      "sidebar.transactions": "Transações",
      "sidebar.categories": "Categorias",
      "sidebar.bankAccounts": "Contas Bancárias",
      "sidebar.relationships": "RELACIONAMENTOS",
      "sidebar.clients": "Clientes",
      "sidebar.suppliers": "Fornecedores",
      "sidebar.reportsSystem": "RELATÓRIOS & SISTEMA",
      "sidebar.reports": "Relatórios",
      "sidebar.settings": "Configurações",
      "sidebar.users": "Usuários",
      
      // Categories
      "categories.title": "Categorias",
      "categories.subtitle": "Gerencie as categorias de receitas e despesas",
      "categories.revenues": "Receitas",
      "categories.expenses": "Despesas",
      "categories.newCategory": "Nova Categoria",
      "categories.newRevenueCategory": "Nova Categoria de Receita",
      "categories.newExpenseCategory": "Nova Categoria de Despesa",
      "categories.categoryName": "Nome da Categoria",
      "categories.enterCategoryName": "Digite o nome da categoria...",
      "categories.editCategory": "Editar Categoria",
      "categories.noRevenueCategories": "Nenhuma categoria de receita cadastrada",
      "categories.noExpenseCategories": "Nenhuma categoria de despesa cadastrada",
      "categories.clickNewCategory": "Clique em \"Nova Categoria\" para começar",
      
      // Dashboard
      "dashboard.filters": "Filtros",
      "dashboard.startDate": "Data Inicial",
      "dashboard.endDate": "Data Final",
      "dashboard.selectDate": "Selecionar data",
      "dashboard.searchDescription": "Busca por Descrição",
      "dashboard.searchPlaceholder": "Digite a descrição...",
      "dashboard.category": "Categoria",
      "dashboard.subcategory": "Subcategoria",
      "dashboard.type": "Tipo",
      "dashboard.paymentMethod": "Forma de Pagamento",
      "dashboard.receiptMethod": "Forma de Recebimento",
      "dashboard.allCategories": "Todas as categorias",
      "dashboard.allSubcategories": "Todas as subcategorias",
      "dashboard.allTypes": "Todos os tipos",
      "dashboard.allPaymentMethods": "Todas as formas de pagamento",
      "dashboard.allReceiptMethods": "Todas as formas de recebimento",
      "dashboard.income": "Receita",
      "dashboard.expense": "Despesa",
      "dashboard.clearFilters": "Limpar Filtros",
      "dashboard.update": "Atualizar",
      "dashboard.export": "Exportar",
      "dashboard.exportOptions": "Opções de Exportação",
      "dashboard.exportPDF": "Exportar como PDF",
      "dashboard.exportExcel": "Exportar como Excel",
      "dashboard.exportCSV": "Exportar como CSV",
      "dashboard.totalRevenue": "Total de Receitas",
      "dashboard.totalExpenses": "Total de Despesas",
      "dashboard.netBalance": "Saldo Líquido",
      "dashboard.revenueByCategory": "Receitas por Categoria",
      "dashboard.expensesByCategory": "Despesas por Categoria",
      "dashboard.revenueVsExpense": "Receita vs Despesa",
      "dashboard.clientRevenue": "Receita por Cliente",
      
      // Users
      "users.title": "Usuários e Permissões",
      "users.subtitle": "Gerencie usuários e seus níveis de acesso ao sistema",
      "users.addUser": "Adicionar Primeiro Usuário",
      "users.newUser": "+ Novo Usuário",
      "users.name": "Nome",
      "users.email": "E-mail",
      "users.accessLevel": "Nível de Acesso",
      "users.administrator": "Administrador",
      "users.financial": "Financeiro",
      "users.viewer": "Visualizador",
      "users.saveUser": "Salvar Usuário",
      "users.cancel": "Cancelar",
      "users.edit": "Editar",
      "users.remove": "Remover",
      "users.accessLevels": {
        "administrador": "Administrador",
        "financeiro": "Financeiro",
        "visualizador": "Visualizador"
      },
      
      // Common
      "common.loading": "Carregando...",
      "common.save": "Salvar",
      "common.cancel": "Cancelar",
      "common.edit": "Editar",
      "common.remove": "Remover",
      "common.actions": "Ações",
      "common.noData": "Nenhum dado encontrado"
    }
  },
  en: {
    translation: {
      // Header
      "header.addCompany": "Add Company",
      "header.companyName": "Company Name",
      "header.cnpj": "CNPJ (optional)",
      "header.adminEmail": "Administrative Email",
      "header.save": "Save",
      "header.cancel": "Cancel",
      "header.myProfile": "My Profile",
      "header.accountSettings": "Account Settings",
      "header.logout": "Logout",
      "header.portuguese": "Portuguese (Brazil)",
      "header.english": "English (American)",
      
      // Sidebar
      "sidebar.main": "MAIN",
      "sidebar.dashboard": "Dashboard",
      "sidebar.financial": "FINANCIAL",
      "sidebar.transactions": "Transactions",
      "sidebar.categories": "Categories",
      "sidebar.bankAccounts": "Bank Accounts",
      "sidebar.relationships": "RELATIONSHIPS",
      "sidebar.clients": "Clients",
      "sidebar.suppliers": "Suppliers",
      "sidebar.reportsSystem": "REPORTS & SYSTEM",
      "sidebar.reports": "Reports",
      "sidebar.settings": "Settings",
      "sidebar.users": "Users",
      
      // Categories
      "categories.title": "Categories",
      "categories.subtitle": "Manage income and expense categories",
      "categories.revenues": "Income",
      "categories.expenses": "Expenses",
      "categories.newCategory": "New Category",
      "categories.newRevenueCategory": "New Income Category",
      "categories.newExpenseCategory": "New Expense Category",
      "categories.categoryName": "Category Name",
      "categories.enterCategoryName": "Enter category name...",
      "categories.editCategory": "Edit Category",
      "categories.noRevenueCategories": "No income categories registered",
      "categories.noExpenseCategories": "No expense categories registered",
      "categories.clickNewCategory": "Click \"New Category\" to start",
      
      // Dashboard
      "dashboard.filters": "Filters",
      "dashboard.startDate": "Start Date",
      "dashboard.endDate": "End Date",
      "dashboard.selectDate": "Select date",
      "dashboard.searchDescription": "Search by Description",
      "dashboard.searchPlaceholder": "Enter description...",
      "dashboard.category": "Category",
      "dashboard.subcategory": "Subcategory",
      "dashboard.type": "Type",
      "dashboard.paymentMethod": "Payment Method",
      "dashboard.receiptMethod": "Receipt Method",
      "dashboard.allCategories": "All categories",
      "dashboard.allSubcategories": "All subcategories",
      "dashboard.allTypes": "All types",
      "dashboard.allPaymentMethods": "All payment methods",
      "dashboard.allReceiptMethods": "All receipt methods",
      "dashboard.income": "Income",
      "dashboard.expense": "Expense",
      "dashboard.clearFilters": "Clear Filters",
      "dashboard.update": "Update",
      "dashboard.export": "Export",
      "dashboard.exportOptions": "Export Options",
      "dashboard.exportPDF": "Export as PDF",
      "dashboard.exportExcel": "Export as Excel",
      "dashboard.exportCSV": "Export as CSV",
      "dashboard.totalRevenue": "Total Income",
      "dashboard.totalExpenses": "Total Expenses",
      "dashboard.netBalance": "Net Balance",
      "dashboard.revenueByCategory": "Income by Category",
      "dashboard.expensesByCategory": "Expenses by Category",
      "dashboard.revenueVsExpense": "Income vs Expense",
      "dashboard.clientRevenue": "Client Income",
      
      // Users
      "users.title": "Users and Permissions",
      "users.subtitle": "Manage users and their access levels to the system",
      "users.addUser": "Add First User",
      "users.newUser": "+ New User",
      "users.name": "Name",
      "users.email": "Email",
      "users.accessLevel": "Access Level",
      "users.administrator": "Administrator",
      "users.financial": "Financial",
      "users.viewer": "Viewer",
      "users.saveUser": "Save User",
      "users.cancel": "Cancel",
      "users.edit": "Edit",
      "users.remove": "Remove",
      "users.accessLevels": {
        "administrador": "Administrator",
        "financeiro": "Financial",
        "visualizador": "Viewer"
      },
      
      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.edit": "Edit",
      "common.remove": "Remove",
      "common.actions": "Actions",
      "common.noData": "No data found"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
