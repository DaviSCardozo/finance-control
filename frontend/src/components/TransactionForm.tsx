import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import type { Transaction, Category } from '../types';

const schema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória').max(255),
  type: z.enum(['REVENUE', 'EXPENSE'], { required_error: 'Selecione o tipo' }),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  status: z.enum(['CONFIRMED', 'PENDING']),
  observation: z.string().optional(),
  categoryId: z.coerce.number().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  transaction?: Transaction | null;
  categories: Category[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onClose,
  onSubmit,
  transaction,
  categories,
}) => {
  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'EXPENSE',
      amount: 0,
      status: 'CONFIRMED',
      observation: '',
      categoryId: null,
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (transaction) {
      reset({
        date: transaction.date,
        description: transaction.description,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        observation: transaction.observation || '',
        categoryId: transaction.categoryId,
      });
    } else {
      reset({
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'EXPENSE',
        amount: 0,
        status: 'CONFIRMED',
        observation: '',
        categoryId: null,
      });
    }
  }, [transaction, reset, open]);

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Lançamento' : 'Novo Lançamento'}
      description={isEditing ? 'Atualize os dados do lançamento' : 'Preencha os dados para registrar um novo lançamento'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
          <Select
            label="Tipo"
            options={[
              { value: 'EXPENSE', label: 'Despesa' },
              { value: 'REVENUE', label: 'Receita' },
            ]}
            error={errors.type?.message}
            {...register('type')}
          />
        </div>

        <Input
          label="Descrição"
          placeholder="Ex: Salário mensal, Conta de luz..."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            error={errors.amount?.message}
            {...register('amount')}
          />
          <Select
            label="Status"
            options={[
              { value: 'CONFIRMED', label: 'Confirmado' },
              { value: 'PENDING', label: 'Pendente' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <Select
          label="Categoria"
          placeholder="Selecione uma categoria"
          options={filteredCategories.map((c) => ({
            value: String(c.id),
            label: c.name,
          }))}
          error={errors.categoryId?.message}
          {...register('categoryId')}
        />

        <Input
          label="Observação"
          placeholder="Notas adicionais (opcional)"
          error={errors.observation?.message}
          {...register('observation')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditing ? 'Salvar alterações' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default TransactionForm;
