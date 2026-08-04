import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { Transaction, PageResponse, DashboardData, Category, TransactionRequest } from '../types';

// =====================
// Dashboard Hook
// =====================
export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, reload: load };
}

// =====================
// Categories Hook
// =====================
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createCategory = async (data: { name: string; type: string; color?: string; icon?: string }) => {
    const res = await api.post('/categories', data);
    await load();
    return res.data;
  };

  const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}`);
    await load();
  };

  return { categories, loading, reload: load, createCategory, deleteCategory };
}

// =====================
// Transactions Hook
// =====================
interface TransactionFilters {
  type?: string;
  status?: string;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: string;
}

export function useTransactions(filters: TransactionFilters) {
  const [data, setData] = useState<PageResponse<Transaction>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 20,
    number: 0,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        page: filters.page,
        size: filters.size,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      };
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.search) params.search = filters.search;

      const res = await api.get('/transactions', { params });
      setData(res.data);
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.size, filters.sortBy, filters.sortDir, filters.type, filters.status, filters.categoryId, filters.startDate, filters.endDate, filters.search]);

  useEffect(() => { load(); }, [load]);

  const createTransaction = async (data: TransactionRequest) => {
    const res = await api.post('/transactions', data);
    await load();
    return res.data;
  };

  const updateTransaction = async (id: number, data: TransactionRequest) => {
    const res = await api.put(`/transactions/${id}`, data);
    await load();
    return res.data;
  };

  const deleteTransaction = async (id: number) => {
    await api.delete(`/transactions/${id}`);
    await load();
  };

  const exportCsv = async () => {
    const params: Record<string, string> = {};
    if (filters.type) params.type = filters.type;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const res = await api.get('/transactions/export', {
      params,
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lancamentos.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return { data, loading, reload: load, createTransaction, updateTransaction, deleteTransaction, exportCsv };
}
