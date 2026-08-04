import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatCurrency, formatDate } from '../utils';
import type { Transaction } from '../types';

interface DataTableProps {
  data: Transaction[];
  pageCount: number;
  currentPage: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSortChange: (field: string) => void;
  sortBy: string;
  sortDir: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const columnHelper = createColumnHelper<Transaction>();

export const DataTable: React.FC<DataTableProps> = ({
  data,
  pageCount,
  currentPage,
  totalElements,
  onPageChange,
  onSortChange,
  sortBy,
  sortDir,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const columns = [
    columnHelper.accessor('date', {
      header: 'Data',
      cell: (info) => (
        <span className="font-medium whitespace-nowrap text-muted-foreground">
          {formatDate(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('description', {
      header: 'Descrição',
      cell: (info) => (
        <div className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]">
          {info.getValue()}
          {info.row.original.observation && (
            <span className="block text-[10px] font-normal text-muted-foreground truncate">
              {info.row.original.observation}
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('categoryName', {
      header: 'Categoria',
      cell: (info) => {
        const catName = info.getValue();
        const color = info.row.original.categoryColor || '#6B7280';
        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-foreground font-medium">
              {catName || 'Sem categoria'}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('type', {
      header: 'Tipo',
      cell: (info) => {
        const isRevenue = info.getValue() === 'REVENUE';
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              isRevenue ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isRevenue ? (
              <>
                <TrendingUp className="h-3.5 w-3.5" /> Receita
              </>
            ) : (
              <>
                <TrendingDown className="h-3.5 w-3.5" /> Despesa
              </>
            )}
          </span>
        );
      },
    }),
    columnHelper.accessor('amount', {
      header: 'Valor',
      cell: (info) => {
        const isRevenue = info.row.original.type === 'REVENUE';
        const val = info.getValue();
        return (
          <span
            className={`font-bold whitespace-nowrap ${
              isRevenue ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
            }`}
          >
            {isRevenue ? '+' : '-'} {formatCurrency(val)}
          </span>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const isConfirmed = info.getValue() === 'CONFIRMED';
        return (
          <Badge variant={isConfirmed ? 'success' : 'warning'}>
            {isConfirmed ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Confirmado
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Pendente
              </span>
            )}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(info.row.original)}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Editar"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(info.row.original.id)}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Excluir"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount,
  });

  const handleHeaderClick = (columnId: string) => {
    if (columnId === 'actions') return;
    onSortChange(columnId);
  };

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Header */}
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3.5 font-semibold cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => handleHeaderClick(header.id)}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.id !== 'actions' && (
                          <ArrowUpDown
                            className={`h-3 w-3 ${
                              sortBy === header.id ? 'text-primary' : 'text-muted-foreground/40'
                            }`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-4 py-3.5">
                      <div className="h-4 bg-muted rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <p className="font-medium text-sm">Nenhum lançamento encontrado</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Crie um novo lançamento para começar a organizar suas finanças.
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-accent/40 transition-colors duration-150 group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          Total: <strong className="text-foreground">{totalElements}</strong> lançamentos
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[11px]">
            Página <strong className="text-foreground">{currentPage + 1}</strong> de{' '}
            <strong className="text-foreground">{pageCount || 1}</strong>
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= pageCount - 1 || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
