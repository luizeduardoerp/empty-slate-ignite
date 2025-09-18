
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface FinancialChartsProps {
  revenueData: Record<string, number>;
  expenseData: Record<string, number>;
  loading: boolean;
  t: (key: string) => string;
}

const generateColors = (count: number) => {
  const colors = [
    "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d",
    "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d",
    "#3b82f6", "#1d4ed8", "#1e40af", "#1e3a8a", "#1a365d",
    "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"
  ];
  return colors.slice(0, count);
};

const formatChartData = (data: Record<string, number>, baseColors: string[]) => {
  return Object.entries(data).map(([name, value], index) => ({
    name,
    value,
    color: baseColors[index % baseColors.length]
  }));
};

const CustomPieChart = ({ data, title, loading }: { data: any[], title: string, loading: boolean }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Nenhum dado encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => `${value}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
              <div className="font-semibold">
                ${item.value.toLocaleString()} ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const FinancialCharts = ({ revenueData, expenseData, loading, t }: FinancialChartsProps) => {
  const revenueColors = ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"];
  const expenseColors = ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"];
  
  const revenueChartData = formatChartData(revenueData, revenueColors);
  const expenseChartData = formatChartData(expenseData, expenseColors);
  
  const totalRevenue = Object.values(revenueData).reduce((sum, val) => sum + val, 0);
  const totalExpenses = Object.values(expenseData).reduce((sum, val) => sum + val, 0);
  
  const revenueVsExpenseData = totalRevenue > 0 || totalExpenses > 0 ? [
    { name: t('dashboard.income'), value: totalRevenue, color: "#22c55e" },
    { name: t('dashboard.expense'), value: totalExpenses, color: "#ef4444" },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomPieChart 
          data={revenueChartData} 
          title={t('dashboard.revenueByCategory')}
          loading={loading}
        />
        <CustomPieChart 
          data={expenseChartData} 
          title={t('dashboard.expensesByCategory')}
          loading={loading}
        />
        <CustomPieChart 
          data={revenueVsExpenseData} 
          title={t('dashboard.revenueVsExpense')}
          loading={loading}
        />
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('dashboard.clientRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {loading ? "Carregando..." : "Funcionalidade em desenvolvimento"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
