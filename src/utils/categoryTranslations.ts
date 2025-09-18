
export const categoryTranslations = {
  'Salaries and Wages': {
    pt: 'Salários e Ordenados',
    en: 'Salaries and Wages'
  },
  'Repairs and Maintenance': {
    pt: 'Reparos e Manutenção',
    en: 'Repairs and Maintenance'
  },
  'Rents': {
    pt: 'Aluguéis',
    en: 'Rents'
  },
  'State Taxes': {
    pt: 'Impostos Estaduais',
    en: 'State Taxes'
  },
  'Property Taxes': {
    pt: 'Impostos sobre Propriedade',
    en: 'Property Taxes'
  },
  'Payroll Taxes': {
    pt: 'Impostos sobre Folha de Pagamento',
    en: 'Payroll Taxes'
  },
  'Licenses': {
    pt: 'Licenças',
    en: 'Licenses'
  },
  'Other Taxes': {
    pt: 'Outros Impostos',
    en: 'Other Taxes'
  },
  'Interest': {
    pt: 'Juros',
    en: 'Interest'
  },
  'Meals': {
    pt: 'Refeições',
    en: 'Meals'
  },
  'Accounting': {
    pt: 'Contabilidade',
    en: 'Accounting'
  },
  'Amortization': {
    pt: 'Amortização',
    en: 'Amortization'
  },
  'Automobile Expenses - Gasoline': {
    pt: 'Despesas Automobilísticas - Gasolina',
    en: 'Automobile Expenses - Gasoline'
  },
  'Automobile Expenses - Repair and Maintenance': {
    pt: 'Despesas Automobilísticas - Reparo e Manutenção',
    en: 'Automobile Expenses - Repair and Maintenance'
  },
  'Bank Charges': {
    pt: 'Taxas Bancárias',
    en: 'Bank Charges'
  },
  'Cleaning': {
    pt: 'Limpeza',
    en: 'Cleaning'
  },
  'Commissions': {
    pt: 'Comissões',
    en: 'Commissions'
  },
  'Computer services and supplies': {
    pt: 'Serviços e Suprimentos de Informática',
    en: 'Computer services and supplies'
  },
  'Credit and collection costs': {
    pt: 'Custos de Crédito e Cobrança',
    en: 'Credit and collection costs'
  },
  'Delivery and freight': {
    pt: 'Entrega e Frete',
    en: 'Delivery and freight'
  },
  'Discounts': {
    pt: 'Descontos',
    en: 'Discounts'
  },
  'Dues and subscriptions': {
    pt: 'Taxas e Assinaturas',
    en: 'Dues and subscriptions'
  },
  'Equipment rent': {
    pt: 'Aluguel de Equipamentos',
    en: 'Equipment rent'
  },
  'Gifts': {
    pt: 'Presentes',
    en: 'Gifts'
  },
  'Insurance': {
    pt: 'Seguros',
    en: 'Insurance'
  },
  'Janitorial': {
    pt: 'Serviços de Limpeza',
    en: 'Janitorial'
  },
  'Laundry and cleaning': {
    pt: 'Lavanderia e Limpeza',
    en: 'Laundry and cleaning'
  },
  'Legal and professional': {
    pt: 'Serviços Jurídicos e Profissionais',
    en: 'Legal and professional'
  },
  'Miscellaneous': {
    pt: 'Diversos',
    en: 'Miscellaneous'
  },
  'Office Expenses': {
    pt: 'Despesas de Escritório',
    en: 'Office Expenses'
  },
  'Outside services/independent contractors': {
    pt: 'Serviços Externos/Contratados Independentes',
    en: 'Outside services/independent contractors'
  },
  'Parking fees and toll': {
    pt: 'Taxas de Estacionamento e Pedágio',
    en: 'Parking fees and toll'
  },
  'Permit and fees': {
    pt: 'Licenças e Taxas',
    en: 'Permit and fees'
  },
  'Postage': {
    pt: 'Postagem',
    en: 'Postage'
  },
  'Printing': {
    pt: 'Impressão',
    en: 'Printing'
  },
  'Security': {
    pt: 'Segurança',
    en: 'Security'
  },
  'Supplies': {
    pt: 'Suprimentos',
    en: 'Supplies'
  },
  'Telephone': {
    pt: 'Telefone',
    en: 'Telephone'
  },
  'Tools': {
    pt: 'Ferramentas',
    en: 'Tools'
  },
  'Training/continuing education': {
    pt: 'Treinamento/Educação Continuada',
    en: 'Training/continuing education'
  },
  'Travel': {
    pt: 'Viagem',
    en: 'Travel'
  },
  'Uniform': {
    pt: 'Uniformes',
    en: 'Uniform'
  },
  'Utilities': {
    pt: 'Utilidades Públicas',
    en: 'Utilities'
  },
  'Sales Revenue': {
    pt: 'Receita de Vendas',
    en: 'Sales Revenue'
  },
  'Service Revenue': {
    pt: 'Receita de Serviços',
    en: 'Service Revenue'
  },
  'Interest Income': {
    pt: 'Receita de Juros',
    en: 'Interest Income'
  },
  'Other Income': {
    pt: 'Outras Receitas',
    en: 'Other Income'
  }
};

export const getCategoryTranslation = (categoryName: string, language: string = 'pt'): string => {
  const translation = categoryTranslations[categoryName as keyof typeof categoryTranslations];
  if (translation) {
    return translation[language as keyof typeof translation] || categoryName;
  }
  return categoryName;
};
