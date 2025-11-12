'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    const verified = searchParams.get('verified');
    const errorParam = searchParams.get('error');
    const message = searchParams.get('message');

    if (verified === 'true') {
      setNotification({
        type: 'success',
        message: 'Email verificado com sucesso! Você já pode fazer login.',
      });
    } else if (errorParam) {
      const errorMessages: Record<string, string> = {
        missing_token: 'Link de verificação inválido. Token não encontrado.',
        invalid_token: 'Token inválido ou expirado. Solicite um novo link.',
        server_error: 'Erro ao verificar email. Tente novamente mais tarde.',
      };
      setNotification({
        type: 'error',
        message: errorMessages[errorParam] || 'Erro ao verificar email.',
      });
    } else if (message === 'already_verified') {
      setNotification({
        type: 'info',
        message: 'Este email já foi verificado anteriormente.',
      });
    }

    if (verified || errorParam || message) {
      const timer = setTimeout(() => {
        window.history.replaceState({}, '', '/login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.type === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/associate/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const notificationStyles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const notificationTextStyles = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  };

  const notificationIcons = {
    success: <CheckCircle className='h-6 w-6 text-green-600' />,
    error: <XCircle className='h-6 w-6 text-red-600' />,
    info: <AlertCircle className='h-6 w-6 text-blue-600' />,
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md'>
        {/* Notificação de Verificação de Email */}
        {notification && (
          <div
            className={`animate-in slide-in-from-top mb-6 rounded-lg border p-4 shadow-lg duration-300 ${notificationStyles[notification.type]}`}
          >
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0'>
                {notificationIcons[notification.type]}
              </div>
              <p
                className={`flex-1 text-sm font-medium ${notificationTextStyles[notification.type]}`}
              >
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className='flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600'
                aria-label='Fechar notificação'
              >
                <XCircle className='h-5 w-5' />
              </button>
            </div>
          </div>
        )}

        {/* Card de Login */}
        <div className='rounded-2xl bg-white p-8 shadow-xl'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>
              Bem-vindo de volta
            </h1>
            <p className='text-gray-600'>Entre com suas credenciais</p>
          </div>

          {error && (
            <div className='mb-6 border-l-4 border-red-500 bg-red-50 p-4 text-red-700'>
              {error}
            </div>
          )}

          <div className='space-y-6'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Email ou Usuário
              </label>
              <input
                type='text'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                placeholder='seu@email.com'
                required
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Senha
              </label>
              <input
                type='password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                placeholder='••••••••'
                required
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className='w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300'
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className='mt-6 space-y-2 text-center'>
            <Link
              href='/reset-password'
              className='text-sm text-blue-600 hover:text-blue-700'
            >
              Esqueceu a senha?
            </Link>
            <div className='text-sm text-gray-600'>
              Não tem uma conta?{' '}
              <Link
                href='/register'
                className='font-medium text-blue-600 hover:text-blue-700'
              >
                Cadastre-se
              </Link>
            </div>
          </div>

          <div className='mt-8 border-t pt-6'>
            <Link
              href='/'
              className='flex items-center justify-center text-sm text-gray-600 hover:text-gray-900'
            >
              ← Voltar para home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
