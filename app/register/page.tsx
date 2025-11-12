'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cpfCnpj: formData.cpfCnpj,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      alert('Conta criada com sucesso! Verifique seu email.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md rounded-2xl bg-white p-8 shadow-xl'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Criar Conta de Administrador
          </h1>
          <p className='text-gray-600'>Preencha os dados abaixo</p>
        </div>

        {error && (
          <div className='mb-6 border-l-4 border-red-500 bg-red-50 p-4 text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Nome Completo
            </label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              required
              minLength={3}
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              CPF ou CNPJ
            </label>
            <input
              type='text'
              value={formData.cpfCnpj}
              onChange={(e) =>
                setFormData({ ...formData, cpfCnpj: e.target.value })
              }
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              placeholder='000.000.000-00'
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
              required
              minLength={8}
            />
            <p className='mt-1 text-xs text-gray-500'>Mínimo de 8 caracteres</p>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Confirmar Senha
            </label>
            <input
              type='password'
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300'
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className='mt-6 text-center text-sm text-gray-600'>
          Já tem uma conta?{' '}
          <Link
            href='/login'
            className='font-medium text-blue-600 hover:text-blue-700'
          >
            Fazer login
          </Link>
        </div>

        <div className='mt-4 text-center'>
          <Link href='/' className='text-sm text-gray-600 hover:text-gray-900'>
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  );
}
