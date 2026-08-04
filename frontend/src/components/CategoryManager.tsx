import React, { useState } from 'react';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Trash2, Plus, Tag } from 'lucide-react';
import type { Category } from '../types';

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onCreateCategory: (data: { name: string; type: string; color?: string; icon?: string }) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
}

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#6366F1', '#059669', '#2563EB', '#6B7280'
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  open,
  onClose,
  categories,
  onCreateCategory,
  onDeleteCategory,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'REVENUE' | 'EXPENSE'>('EXPENSE');
  const [color, setColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await onCreateCategory({ name: name.trim(), type, color });
      setName('');
    } catch (err) {
      console.error('Failed to create category', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onDeleteCategory(id);
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  const revenueCategories = categories.filter((c) => c.type === 'REVENUE');
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Gerenciar Categorias"
      description="Crie e personalize suas categorias de receitas e despesas"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Create Form */}
        <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-border bg-muted/30 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Nova Categoria
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Nome da categoria..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Select
              options={[
                { value: 'EXPENSE', label: 'Despesa' },
                { value: 'REVENUE', label: 'Receita' },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value as 'REVENUE' | 'EXPENSE')}
            />
          </div>

          {/* Color selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Cor do ícone</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-ring ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" size="sm" loading={loading} disabled={!name.trim()}>
              Adicionar
            </Button>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="space-y-4">
          {/* Revenue List */}
          <div>
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              Categorias de Receitas ({revenueCategories.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {revenueCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#10B981' }}
                    />
                    <span className="font-medium truncate">{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Expense List */}
          <div>
            <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
              Categorias de Despesas ({expenseCategories.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#EF4444' }}
                    />
                    <span className="font-medium truncate">{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CategoryManager;
