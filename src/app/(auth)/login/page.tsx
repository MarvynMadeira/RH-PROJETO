'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabase } from '../../../lib/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClientSupabase();

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Mapeia erros comuns para mensagens mais amigáveis
        if (error.message.includes('Invalid login credentials')) {
          throw new Error(
            'Credenciais inválidas. Verifique seu email e senha.',
          );
        }
        throw error;
      }

      // Redireciona e força um refresh para que os Server Components reconheçam o novo cookie
      router.push('/formularios');
      router.refresh();
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.message || 'Erro desconhecido ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>RH Helper</h1>
          <p className='mt-2 text-gray-600'>Faça login na sua conta</p>
        </div>

        <div className='rounded-lg bg-white p-8 shadow-2xl'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='rounded border border-red-200 bg-red-50 p-4 font-medium text-red-700'>
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor='email'
                className='mb-1 block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                required
                value={formData.email}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='mb-1 block text-sm font-medium text-gray-700'
              >
                Senha
              </label>
              <input
                id='password'
                type='password'
                required
                value={formData.password}
                onChange={handleInputChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition duration-150 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Não tem uma conta?{' '}
              <a
                href='/registro'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                Registrar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
