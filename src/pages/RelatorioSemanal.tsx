import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Download, TrendingUp, TrendingDown, DollarSign, FileBarChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export const RelatorioSemanal = () => {
  const [selectedWeek, setSelectedWeek] = useState("current");

  const weeklyData = [
    { day: "Seg", receitas: 4500, despesas: 2800 },
    { day: "Ter", receitas: 5200, despesas: 3100 },
    { day: "Qua", receitas: 4800, despesas: 2900 },
    { day: "Qui", receitas: 6100, despesas: 3400 },
    { day: "Sex", receitas: 7300, despesas: 4200 },
    { day: "Sab", receitas: 3200, despesas: 1800 },
    { day: "Dom", receitas: 2100, despesas: 1200 },
  ];

  const categoryData = [
    { name: "Vendas", value: 45, color: "#8884d8" },
    { name: "Serviços", value: 30, color: "#82ca9d" },
    { name: "Produtos", value: 15, color: "#ffc658" },
    { name: "Outros", value: 10, color: "#ff7300" },
  ];

  const weeklyMetrics = [
    {
      title: "Receita Total",
      value: "$33,200",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Despesas Totais",
      value: "$19,400",
      change: "-5%",
      trend: "down",
      icon: TrendingDown,
    },
    {
      title: "Lucro Líquido",
      value: "$13,800",
      change: "+18%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Margem",
      value: "41.6%",
      change: "+2.1%",
      trend: "up",
      icon: FileBarChart,
    },
  ];

  const topTransactions = [
    { description: "Pagamento Cliente XYZ Corp", amount: "+$8,500", type: "receita", date: "Qui, 14:30" },
    { description: "Fornecedor ABC Ltda", amount: "-$3,200", type: "despesa", date: "Qua, 09:15" },
    { description: "Venda Produto Premium", amount: "+$4,750", type: "receita", date: "Sex, 16:45" },
    { description: "Aluguel Escritório", amount: "-$2,800", type: "despesa", date: "Seg, 08:00" },
    { description: "Consultoria Especializada", amount: "+$6,100", type: "receita", date: "Ter, 11:20" },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatório Semanal</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho financeiro da semana</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Semana Atual</SelectItem>
              <SelectItem value="last">Semana Passada</SelectItem>
              <SelectItem value="two-weeks">2 Semanas Atrás</SelectItem>
              <SelectItem value="three-weeks">3 Semanas Atrás</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {weeklyMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center text-xs ${getTrendColor(metric.trend)}`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {metric.change} vs semana anterior
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="daily">Análise Diária</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>Comparativo diário da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="receitas" fill="#8884d8" />
                    <Bar dataKey="despesas" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Receitas por categoria de negócio</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Principais Transações</CardTitle>
              <CardDescription>Movimentações mais significativas da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount}
                      </p>
                      <Badge variant={transaction.type === 'receita' ? 'default' : 'secondary'}>
                        {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendência Diária</CardTitle>
              <CardDescription>Evolução das receitas ao longo da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="receitas" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="despesas" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryData.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.name}
                    <Badge style={{ backgroundColor: category.color }} className="text-white">
                      {category.value}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold">
                      ${((33200 * category.value) / 100).toLocaleString()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${category.value}%`, backgroundColor: category.color }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {category.value}% do total de receitas da semana
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Transações</CardTitle>
              <CardDescription>Detalhamento completo de movimentações da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...topTransactions, ...topTransactions].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${transaction.type === 'receita' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <h3 className="font-medium">{transaction.description}</h3>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount}
                      </p>
                      <Badge variant={transaction.type === 'receita' ? 'default' : 'secondary'} className="mt-1">
                        {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};