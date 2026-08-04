// ===========================
// FinanceControl - TypeScript Types
// ===========================

export interface User {
  username: string;
  email: string;
  fullName: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'REVENUE' | 'EXPENSE';
  color: string;
  icon: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  type: 'REVENUE' | 'EXPENSE';
  amount: number;
  status: 'CONFIRMED' | 'PENDING';
  observation: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  categoryIcon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRequest {
  date: string;
  description: string;
  type: string;
  amount: number;
  status: string;
  observation?: string;
  categoryId?: number | null;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface DashboardData {
  currentBalance: number;
  monthlyRevenues: number;
  monthlyExpenses: number;
  forecastedBalance: number;
  expensesByCategory: CategoryTotal[];
  monthlyComparison: MonthlyComparison[];
  balanceEvolution: BalancePoint[];
}

export interface CategoryTotal {
  categoryName: string;
  categoryColor: string;
  total: number;
}

export interface MonthlyComparison {
  month: string;
  revenues: number;
  expenses: number;
}

export interface BalancePoint {
  month: string;
  balance: number;
}
