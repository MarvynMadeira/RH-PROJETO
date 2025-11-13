'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

// Este Layout irá envolver todas as páginas (children) dentro da pasta 'admin'
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lógica de Autenticação (Movida do dashboard principal para o Layout)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>Carregando...</p>
        </div>
      </div>
    );
  }

  // A estrutura visual que será compartilhada por todas as páginas
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* HEADER: Fixado em todas as páginas */}
      <header className='bg-white shadow'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            {/* Link para o Dashboard principal */}
            <Link href='/admin' className='transition hover:opacity-80'>
              <h1 className='text-2xl font-bold text-gray-900'>RH Helper</h1>
              <p className='text-sm text-gray-600'>
                Bem-vindo, {user?.name || 'Admin'}
              </p>
            </Link>

            <button
              onClick={handleLogout}
              className='rounded-lg px-4 py-2 text-red-600 transition hover:bg-red-50'
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL: A cor de fundo 'bg-gray-50' é definida no div principal. */}
      <main className='container mx-auto px-4 py-8'>
        {children} {/* Aqui entra o conteúdo específico de cada page.tsx */}
      </main>
    </div>
  );
}
