'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Associate {
  id: string;
  name: string;
  email: string;
  cpf: string;
  status: 'active' | 'inactive';
  registrationDate: string;
}

export default function AdminInactiveAssociatesPage() {
  const router = useRouter();
  const [inactiveAssociates, setInactiveAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== 'admin') {
        router.push('/login');
        return;
      }
    } catch (e) {
      router.push('/login');
      return;
    }

    loadInactiveAssociates(token);
  }, [router]);

  const loadInactiveAssociates = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/associates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Falha ao carregar dados dos associados.');
      }

      const data = await res.json();

      const inactive = (data.associates || [])
        .filter((a: Associate) => a.status === 'inactive')
        .sort(
          (a: Associate, b: Associate) =>
            new Date(b.registrationDate).getTime() -
            new Date(a.registrationDate).getTime(),
        ); // Ordena por data de registro

      setInactiveAssociates(inactive);
    } catch (err: any) {
      console.error('Erro:', err);
      setError(
        'Não foi possível carregar a lista de associados desvinculados.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-red-600'></div>
          <p className='text-gray-600'>Carregando lista de desvinculados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto p-8 text-center'>
        <h2 className='text-xl font-bold text-red-600'>{error}</h2>
        <button
          onClick={() =>
            loadInactiveAssociates(localStorage.getItem('token') || '')
          }
          className='mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700'
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Associados Desvinculados ({inactiveAssociates.length})
          </h1>
          {/* Botão para voltar ao dashboard */}
          <Link
            href='/admin/dashboard'
            className='flex items-center text-sm font-medium text-blue-600 transition hover:text-blue-800'
          >
            <svg
              className='mr-1 h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Voltar ao Painel Principal
          </Link>
        </div>

        {inactiveAssociates.length === 0 ? (
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <p className='text-center text-lg text-gray-500'>
              Nenhum associado desvinculado encontrado. 🎉
            </p>
          </div>
        ) : (
          <div className='overflow-hidden rounded-xl bg-white shadow-md'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Nome
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    E-mail
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    CPF
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Desvinculação
                  </th>
                  <th className='relative px-6 py-3'>
                    <span className='sr-only'>Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {inactiveAssociates.map((associate) => (
                  <tr key={associate.id}>
                    <td className='px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                      {associate.name}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                      {associate.email}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                      {associate.cpf}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                      {new Date(associate.registrationDate).toLocaleDateString(
                        'pt-BR',
                      )}
                    </td>
                    <td className='px-6 py-4 text-right text-sm font-medium whitespace-nowrap'>
                      <Link
                        href={`/admin/associates/${associate.id}`}
                        className='text-red-600 hover:text-red-900'
                      >
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
