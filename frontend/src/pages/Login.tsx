import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LogIn } from 'lucide-react';
import api from '../services/api';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      login(response.data);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Credenciais inválidas. Tente novamente.');
      } else {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-sm bg-card border border-border p-8 rounded-2xl shadow-medium relative animate-fade-in">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-glow mb-1">
            <span className="text-primary-foreground font-black text-lg">F</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Entrar no FinanceControl</h2>
          <p className="text-xs text-muted-foreground">Controle financeiro pessoal simples e profissional</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Usuário"
            id="username"
            type="text"
            placeholder="Seu nome de usuário"
            error={errors.username?.message}
            {...register('username')}
          />

          <Input
            label="Senha"
            id="password"
            type="password"
            placeholder="Sua senha"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            className="w-full mt-6 py-2.5"
            loading={loading}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold transition-colors">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
