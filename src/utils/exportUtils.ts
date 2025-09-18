
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ExportData {
  financialSummary: {
    totalReceitas: number;
    totalDespesas: number;
    saldoLiquido: number;
  };
  categoriesData: {
    receitasData: Record<string, number>;
    despesasData: Record<string, number>;
  };
  transactions: any[];
}

export const exportToPDF = async (data: ExportData, t: (key: string) => string) => {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(20);
  pdf.text(t('dashboard.filters'), 20, 30);
  
  // Financial Summary
  pdf.setFontSize(14);
  pdf.text(t('dashboard.totalRevenue') + ': $' + data.financialSummary.totalReceitas.toLocaleString(), 20, 50);
  pdf.text(t('dashboard.totalExpenses') + ': $' + data.financialSummary.totalDespesas.toLocaleString(), 20, 65);
  pdf.text(t('dashboard.netBalance') + ': $' + data.financialSummary.saldoLiquido.toLocaleString(), 20, 80);
  
  // Categories by Income
  let yPosition = 100;
  pdf.setFontSize(12);
  pdf.text(t('dashboard.revenueByCategory'), 20, yPosition);
  yPosition += 15;
  
  Object.entries(data.categoriesData.receitasData).forEach(([category, value]) => {
    pdf.text(`${category}: $${value.toLocaleString()}`, 30, yPosition);
    yPosition += 10;
  });
  
  // Categories by Expense
  yPosition += 10;
  pdf.text(t('dashboard.expensesByCategory'), 20, yPosition);
  yPosition += 15;
  
  Object.entries(data.categoriesData.despesasData).forEach(([category, value]) => {
    pdf.text(`${category}: $${value.toLocaleString()}`, 30, yPosition);
    yPosition += 10;
  });
  
  pdf.save('financial-report.pdf');
};

export const exportToExcel = (data: ExportData, t: (key: string) => string) => {
  const workbook = XLSX.utils.book_new();
  
  // Financial Summary Sheet
  const summaryData = [
    [t('dashboard.totalRevenue'), data.financialSummary.totalReceitas],
    [t('dashboard.totalExpenses'), data.financialSummary.totalDespesas],
    [t('dashboard.netBalance'), data.financialSummary.saldoLiquido]
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Revenue Categories Sheet
  const revenueData = Object.entries(data.categoriesData.receitasData).map(([category, value]) => [category, value]);
  revenueData.unshift(['Category', 'Amount']);
  const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
  XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Revenue by Category');
  
  // Expense Categories Sheet
  const expenseData = Object.entries(data.categoriesData.despesasData).map(([category, value]) => [category, value]);
  expenseData.unshift(['Category', 'Amount']);
  const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
  XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses by Category');
  
  // Transactions Sheet
  if (data.transactions.length > 0) {
    const transactionsSheet = XLSX.utils.json_to_sheet(data.transactions);
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');
  }
  
  XLSX.writeFile(workbook, 'financial-report.xlsx');
};

export const exportToCSV = (data: ExportData, t: (key: string) => string) => {
  let csvContent = '';
  
  // Financial Summary
  csvContent += t('dashboard.totalRevenue') + ',' + data.financialSummary.totalReceitas + '\n';
  csvContent += t('dashboard.totalExpenses') + ',' + data.financialSummary.totalDespesas + '\n';
  csvContent += t('dashboard.netBalance') + ',' + data.financialSummary.saldoLiquido + '\n\n';
  
  // Revenue Categories
  csvContent += t('dashboard.revenueByCategory') + '\n';
  csvContent += 'Category,Amount\n';
  Object.entries(data.categoriesData.receitasData).forEach(([category, value]) => {
    csvContent += `${category},${value}\n`;
  });
  
  csvContent += '\n';
  
  // Expense Categories
  csvContent += t('dashboard.expensesByCategory') + '\n';
  csvContent += 'Category,Amount\n';
  Object.entries(data.categoriesData.despesasData).forEach(([category, value]) => {
    csvContent += `${category},${value}\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'financial-report.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
