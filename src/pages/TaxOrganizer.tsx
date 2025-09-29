import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Calendar, DollarSign } from "lucide-react";

export const TaxOrganizer = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  const taxCategories = [
    { name: "Receitas", amount: "$125,000", documents: 45, status: "complete" },
    { name: "Despesas Operacionais", amount: "$75,000", documents: 32, status: "pending" },
    { name: "Investimentos", amount: "$25,000", documents: 12, status: "complete" },
    { name: "Impostos Pagos", amount: "$18,500", documents: 8, status: "review" },
  ];

  const documents = [
    { name: "Receita Federal - IRPJ 2024", type: "PDF", date: "2024-03-15", size: "2.5 MB" },
    { name: "Comprovantes de Despesas Q1", type: "ZIP", date: "2024-03-10", size: "15.2 MB" },
    { name: "Notas Fiscais Janeiro", type: "PDF", date: "2024-02-01", size: "8.7 MB" },
    { name: "Relatório Contábil Anual", type: "XLSX", date: "2024-01-30", size: "4.1 MB" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "review": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "complete": return "Completo";
      case "pending": return "Pendente";
      case "review": return "Em Revisão";
      default: return "N/A";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tax Organizer</h1>
          <p className="text-muted-foreground">Organize seus documentos fiscais e prepare suas declarações</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$125,000</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao ano anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$75,000</div>
                <p className="text-xs text-muted-foreground">-5% em relação ao ano anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documentos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">97</div>
                <p className="text-xs text-muted-foreground">Organizados em {taxCategories.length} categorias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">85%</div>
                <p className="text-xs text-muted-foreground">Preparação completa</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo por Categoria</CardTitle>
              <CardDescription>Progresso da organização dos documentos fiscais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.documents} documentos</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold">{category.amount}</p>
                    </div>
                    <Badge className={getStatusColor(category.status)}>
                      {getStatusText(category.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Categorias</CardTitle>
              <CardDescription>Organize seus documentos por categoria fiscal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {taxCategories.map((category, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.documents} documentos • {category.amount}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(category.status)}>
                            {getStatusText(category.status)}
                          </Badge>
                          <Button variant="outline" size="sm">Editar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Fiscais</CardTitle>
              <CardDescription>Todos os documentos organizados para o ano {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{doc.date}</p>
                      <div className="flex gap-2 mt-1">
                        <Button variant="outline" size="sm">Visualizar</Button>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Documentos</CardTitle>
              <CardDescription>Adicione novos documentos fiscais ao seu organizador</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Arraste arquivos aqui ou clique para selecionar</h3>
                <p className="text-sm text-muted-foreground mb-4">PDF, DOC, XLS, ZIP até 25MB</p>
                <Button>Selecionar Arquivos</Button>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receitas">Receitas</SelectItem>
                        <SelectItem value="despesas">Despesas Operacionais</SelectItem>
                        <SelectItem value="investimentos">Investimentos</SelectItem>
                        <SelectItem value="impostos">Impostos Pagos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano Fiscal</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Input placeholder="Adicione uma descrição para o documento..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};