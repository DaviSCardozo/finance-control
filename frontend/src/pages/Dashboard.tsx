import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Plus,
  Tag,
  Download,
  Search,
  Filter,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CardSkeleton } from '../components/ui/Skeleton';
import DataTable from '../components/DataTable';
import TransactionForm from '../components/TransactionForm';
import CategoryManager from '../components/CategoryManager';
import { useDashboard, useCategories, useTransactions } from '../hooks/useFinance';
import { formatCurrency } from '../utils';
import type { Transaction, TransactionRequest } from '../types';

export const Dashboard: React.FC = () => {
  // State for modals
  const [txFormOpen, setTxFormOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [catManagerOpen, setCatManagerOpen] = useState(false);

  // State for analytics charts visibility
  const [chartsOpen, setChartsOpen] = useState(true);

  // State for table filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination & Sorting state
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // Custom hooks
  const { data: dashboardData, loading: dashLoading, reload: reloadDash } = useDashboard();
  const { categories, createCategory, deleteCategory } = useCategories();
  const {
    data: txData,
    loading: txLoading,
    reload: reloadTx,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    exportCsv,
  } = useTransactions({
    page,
    size: 15,
    sortBy,
    sortDir,
    search: search || undefined,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
    categoryId: categoryFilter ? Number(categoryFilter) : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Handle Sort Toggle
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  // Transaction form handlers
  const handleOpenCreate = () => {
    setSelectedTx(null);
    setTxFormOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setSelectedTx(tx);
    setTxFormOpen(true);
  };

  const handleSaveTransaction = async (formData: any) => {
    const payload: TransactionRequest = {
      date: formData.date,
      description: formData.description,
      type: formData.type,
      amount: formData.amount,
      status: formData.status,
      observation: formData.observation || undefined,
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
    };

    if (selectedTx) {
      await updateTransaction(selectedTx.id, payload);
    } else {
      await createTransaction(payload);
    }
    reloadDash();
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      await deleteTransaction(id);
      reloadDash();
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1', '#6B7280'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ========================================================== */}
      {/* 1. TOP METRICS CARDS                                       */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashLoading || !dashboardData ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Saldo Atual */}
            <Card className="hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Saldo Atual
                </span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Wallet className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tight">
                  {formatCurrency(dashboardData.currentBalance)}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Soma das receitas e despesas confirmadas</p>
              </CardContent>
            </Card>

            {/* Entradas do Mês */}
            <Card className="hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Entradas do Mês
                </span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(dashboardData.monthlyRevenues)}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Receitas confirmadas neste mês</p>
              </CardContent>
            </Card>

            {/* Saídas do Mês */}
            <Card className="hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Saídas do Mês
                </span>
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                  <TrendingDown className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tight text-red-600 dark:text-red-400">
                  {formatCurrency(dashboardData.monthlyExpenses)}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Despesas confirmadas neste mês</p>
              </CardContent>
            </Card>

            {/* Saldo Projetado (Destacado) */}
            <Card className="border-primary/30 bg-primary/5 hover:shadow-glow transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Sparkles className="h-16 w-16 text-primary" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Saldo Projetado
                </span>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CalendarIcon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tight text-primary">
                  {formatCurrency(dashboardData.forecastedBalance)}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Projeção até o fim do mês (inclui pendências)
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* ========================================================== */}
      {/* 2. CHARTS SECTION (COLLAPSIBLE)                            */}
      {/* ========================================================== */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        <button
          onClick={() => setChartsOpen(!chartsOpen)}
          className="w-full px-5 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors border-b border-border/50 text-xs font-semibold"
        >
          <div className="flex items-center gap-2 text-foreground">
            <BarChart2 className="h-4 w-4 text-primary" />
            <span>Relatórios Visuais & Gráficos</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-[11px]">{chartsOpen ? 'Ocultar' : 'Expandir'}</span>
            {chartsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {chartsOpen && dashboardData && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Gráfico Pizza - Distribuição de Despesas */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <PieChartIcon className="h-3.5 w-3.5 text-primary" /> Distribuição das Despesas
                </CardTitle>
                <CardDescription className="text-[11px]">Gastos confirmados por categoria no mês</CardDescription>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center">
                {dashboardData.expensesByCategory.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhuma despesa registrada este mês.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.expensesByCategory}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="total"
                        nameKey="categoryName"
                      >
                        {dashboardData.expensesByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.categoryColor || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val: any) => formatCurrency(Number(val))} />
                      <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Gráfico Barras - Entradas x Saídas */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5 text-primary" /> Entradas x Saídas por Mês
                </CardTitle>
                <CardDescription className="text-[11px]">Comparativo dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.monthlyComparison}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" fontSize={10} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip formatter={(val: any) => formatCurrency(Number(val))} />
                    <Bar dataKey="revenues" name="Entradas" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Saídas" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico Linha - Evolução do Saldo */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <LineChartIcon className="h-3.5 w-3.5 text-primary" /> Evolução do Saldo
                </CardTitle>
                <CardDescription className="text-[11px]">Tendência acumulada nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.balanceEvolution}>
                    <defs>
                      <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" fontSize={10} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip formatter={(val: any) => formatCurrency(Number(val))} />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      name="Saldo Acumulado"
                      stroke="#3B82F6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorBal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* 3. SPREADSHEET TABLE SECTION                              */}
      {/* ========================================================== */}
      <div className="space-y-4">
        {/* Action Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar lançamento..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Select
              className="h-9 text-xs w-32"
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
              options={[
                { value: '', label: 'Todos os tipos' },
                { value: 'REVENUE', label: 'Receitas' },
                { value: 'EXPENSE', label: 'Despesas' },
              ]}
            />

            <Select
              className="h-9 text-xs w-32"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              options={[
                { value: '', label: 'Todos status' },
                { value: 'CONFIRMED', label: 'Confirmados' },
                { value: 'PENDING', label: 'Pendentes' },
              ]}
            />

            <Select
              className="h-9 text-xs w-36"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
              placeholder="Todas categorias"
              options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCatManagerOpen(true)}>
              <Tag className="h-3.5 w-3.5 mr-1.5" /> Categorias
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Exportar CSV
            </Button>
            <Button size="sm" onClick={handleOpenCreate}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Novo Lançamento
            </Button>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          data={txData.content}
          pageCount={txData.totalPages}
          currentPage={txData.number}
          totalElements={txData.totalElements}
          onPageChange={setPage}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortDir={sortDir}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteTransaction}
          loading={txLoading}
        />
      </div>

      {/* ========================================================== */}
      {/* 4. MODALS                                                  */}
      {/* ========================================================== */}
      <TransactionForm
        open={txFormOpen}
        onClose={() => setTxFormOpen(false)}
        onSubmit={handleSaveTransaction}
        transaction={selectedTx}
        categories={categories}
      />

      <CategoryManager
        open={catManagerOpen}
        onClose={() => setCatManagerOpen(false)}
        categories={categories}
        onCreateCategory={createCategory}
        onDeleteCategory={deleteCategory}
      />
    </div>
  );
};

export default Dashboard;
