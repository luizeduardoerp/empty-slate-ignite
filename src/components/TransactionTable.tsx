import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

interface Transaction {
  id: string;
  tipo: 'receita' | 'despesa';
  valor: number;
  categoria_id?: string;
  client_id?: string;
  bank_account_id?: string;
  payment_method: string;
  data_vencimento: string;
  descricao?: string;
  status: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    nome: string;
    tipo: string;
  };
  client?: {
    id: string;
    empresa: string;
  };
}

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionTable = ({ transactions, loading }: TransactionTableProps) => {
  const { t, i18n } = useTranslation();

  const getDateLocale = () => {
    return i18n.language === 'pt' ? ptBR : enUS;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: i18n.language === 'pt' ? 'Pendente' : 'Pending', variant: 'secondary' as const },
      paid: { label: i18n.language === 'pt' ? 'Pago' : 'Paid', variant: 'default' as const },
      overdue: { label: i18n.language === 'pt' ? 'Vencido' : 'Overdue', variant: 'destructive' as const },
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };

  const getTypeBadge = (type: string) => {
    if (type === 'receita') {
      return { label: i18n.language === 'pt' ? 'Receita' : 'Income', className: 'bg-green-100 text-green-700 hover:bg-green-100' };
    } else {
      return { label: i18n.language === 'pt' ? 'Despesa' : 'Expense', className: 'bg-red-100 text-red-700 hover:bg-red-100' };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{i18n.language === 'pt' ? 'Lançamentos' : 'Transactions'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            {i18n.language === 'pt' ? 'Carregando...' : 'Loading...'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{i18n.language === 'pt' ? 'Lançamentos' : 'Transactions'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{i18n.language === 'pt' ? 'Tipo' : 'Type'}</TableHead>
                <TableHead>{i18n.language === 'pt' ? 'Data' : 'Date'}</TableHead>
                <TableHead>{i18n.language === 'pt' ? 'Descrição' : 'Description'}</TableHead>
                <TableHead>{i18n.language === 'pt' ? 'Categoria' : 'Category'}</TableHead>
                <TableHead>{i18n.language === 'pt' ? 'Cliente' : 'Client'}</TableHead>
                <TableHead>{i18n.language === 'pt' ? 'Método' : 'Method'}</TableHead>
                <TableHead className="text-right">{i18n.language === 'pt' ? 'Valor' : 'Amount'}</TableHead>
                <TableHead>{i18n.language === 'pt' ? 'Status' : 'Status'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    {i18n.language === 'pt' ? 'Nenhuma transação encontrada' : 'No transactions found'}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => {
                  const typeBadge = getTypeBadge(transaction.tipo);
                  const statusBadge = getStatusBadge(transaction.status);
                  
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge className={typeBadge.className}>
                          {typeBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(transaction.data_vencimento), 'dd/MM/yyyy', {
                          locale: getDateLocale()
                        })}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.descricao || '-'}
                      </TableCell>
                      <TableCell>
                        {transaction.category?.nome || '-'}
                      </TableCell>
                      <TableCell>
                        {transaction.client?.empresa || '-'}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.payment_method.replace('_', ' ')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.tipo === 'despesa' ? '-' : ''}
                          {formatCurrency(transaction.valor)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};