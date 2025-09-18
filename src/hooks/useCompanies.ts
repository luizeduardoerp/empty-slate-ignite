import { useState } from "react";

export interface Company {
  id: number;
  name: string;
  cnpj?: string;
  email: string;
  logo?: string;
}

export const useCompanies = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([
    { 
      id: 1, 
      name: "DUNEBI", 
      cnpj: "", 
      email: "admin@dunebi.com",
      logo: "/lovable-uploads/7d9a117a-0c15-4fd1-bdde-20c898cd606f.png"
    }
  ]);

  const currentCompany = selectedCompany || companies[0];

  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      id: Date.now(),
      ...company
    };
    setCompanies([...companies, newCompany]);
    return newCompany;
  };

  return {
    selectedCompany,
    setSelectedCompany,
    companies,
    setCompanies,
    currentCompany,
    addCompany
  };
};