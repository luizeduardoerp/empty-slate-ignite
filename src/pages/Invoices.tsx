import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Eye, Edit, Trash2, Send, Download, FileText } from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdDate: string;
}

export const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const invoices: Invoice[] = [
    {
      id: "1",
      number: "INV-2024-001",
      client: "Tech Solutions Inc.",
      amount: 15750.00,
      status: "paid",
      dueDate: "2024-03-15",
      createdDate: "2024-02-15"
    },
    {
      id: "2",
      number: "INV-2024-002",
      client: "Marketing Pro Ltd.",
      amount: 8500.00,
      status: "sent",
      dueDate: "2024-03-20",
      createdDate: "2024-02-20"
    },
    {
      id: "3",
      number: "INV-2024-003",
      client: "Design Studio Co.",
      amount: 12300.00,
      status: "overdue",
      dueDate: "2024-03-10",
      createdDate: "2024-02-10"
    },
    {
      id: "4",
      number: "INV-2024-004",
      client: "Consulting Group",
      amount: 22000.00,
      status: "draft",
      dueDate: "2024-03-25",
      createdDate: "2024-03-01"
    },
    {
      id: "5",
      number: "INV-2024-005",
      client: "E-commerce Plus",
      amount: 9750.00,
      status: "sent",
      dueDate: "2024-03-30",
      createdDate: "2024-03-05"
    }
  ];

  const getStatusBadge = (status: Invoice['status']) => {
    const statusConfig = {
      draft: { label: "Rascunho", className: "bg-gray-100 text-gray-800" },
      sent: { label: "Enviado", className: "bg-blue-100 text-blue-800" },
      paid: { label: "Pago", className: "bg-green-100 text-green-800" },
      overdue: { label: "Vencido", className: "bg-red-100 text-red-800" }
    };

    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusStats = () => {
    const stats = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      acc.total += invoice.amount;
      return acc;
    }, { draft: 0, sent: 0, paid: 0, overdue: 0, total: 0 } as any);

    return stats;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = getStatusStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Gerencie suas faturas e cobranças</p>
        </div>
        <Dialog open={showNewInvoice} onOpenChange={setShowNewInvoice}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Fatura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Fatura</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova fatura
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech-solutions">Tech Solutions Inc.</SelectItem>
                      <SelectItem value="marketing-pro">Marketing Pro Ltd.</SelectItem>
                      <SelectItem value="design-studio">Design Studio Co.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Data de Vencimento</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Serviço</Label>
                <Textarea placeholder="Descreva os serviços prestados..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Valor Unitário</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total</Label>
                  <Input type="number" placeholder="0.00" disabled />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewInvoice(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowNewInvoice(false)}>
                Criar Fatura
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{invoices.length} faturas total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">Faturas quitadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sent}</div>
            <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Faturas</CardTitle>
              <CardDescription>Gerencie todas as suas faturas em um só lugar</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar faturas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="sent">Enviado</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell className="font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{new Date(invoice.createdDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {invoice.status === 'draft' && (
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};